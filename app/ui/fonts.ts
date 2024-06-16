import {Inter, Lusitana} from 'next/font/google';
import {undefined} from "zod";

// Specifiy that we want "latin" subset of inter
export const inter = Inter({subsets: ['latin']});
export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin']
});
