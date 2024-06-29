'use server';

import {z} from 'zod';
import sql from "@/app/lib/db";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});

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

    await sql`
        INSERT INTO dashboard.invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    // left off here: https://nextjs.org/learn/dashboard-app/mutating-data#4-validate-and-prepare-the-data
}
