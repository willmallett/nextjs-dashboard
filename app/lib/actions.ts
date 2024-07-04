'use server';

import {z} from 'zod';
import sql from "@/app/lib/db";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.', // add a custom error message
    }),
    amount: z.coerce.number()
        .gt(0, {message: 'Amount must be greater than 0.'}), // make sure amount is greater than 0
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.', // add a custom error message
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true}); // Omit the id and date fields from the schema
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type InvoiceInputState = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

// useActionState will pass prevState to your action now. Could set it as "_" if desired
export async function createInvoice(prevState: InvoiceInputState, formData: FormData) {
    // 1. Validate the form data using Zod
    const validatedFields = CreateInvoice.safeParse({ // use safeParse to get success or error field
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // 2. If the form data is invalid, return an error message
    // safeParse will add success here if the form data is valid
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors, // zodError has flatten method
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Or use this if formData object is huge:
    // const rawFormData = Object.fromEntries(formData.entries());

    // 3. Prepare the data for insertion into the database
    // Store monetary values in cents in your database to eliminate floating point errors and ensure greater accuracy.
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]; // Get today's date in format "YYYY-MM-DD"

    // 4. Insert the data into the database
    try {
        await sql`
            INSERT INTO dashboard.invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        console.error('Create Invoice Database Error:', error);

        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // 5. Revalidate the cache for the invoices page and redirect to the invoices page
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: InvoiceInputState, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE dashboard.invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Update Invoice Database Error:', error);

        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`
            DELETE FROM dashboard.invoices
            WHERE id = ${id}
        `;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice' };
    } catch (error) {
        console.error('Delete Invoice Database Error:', error);

        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }

        throw error;
    }
}
