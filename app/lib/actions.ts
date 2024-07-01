'use server';

import {z} from 'zod';
import sql from "@/app/lib/db";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true}); // Omit the id and date fields from the schema
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Or use this if formData object is huge:
    // const rawFormData = Object.fromEntries(formData.entries());

    // Store monetary values in cents in your database to eliminate floating point errors and ensure greater accuracy.
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]; // Get today's date in format "YYYY-MM-DD"

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

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

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
