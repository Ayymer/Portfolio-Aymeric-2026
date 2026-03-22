import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const caseImageSchema = z.object({
  bg: z.string(),
  fg: z.string(),
  variant: z.enum(['standard', 'phones', 'wide']).default('standard'),
});

const sectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('brief'),
    heading: z.string(),
    content: z.string(),
    image: caseImageSchema.optional(),
  }),
  z.object({
    type: z.literal('two-column'),
    heading: z.string(),
    highlight: z.string(),
    detail: z.string(),
    image: caseImageSchema.optional(),
  }),
]);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/projects' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    services: z.array(z.string()),
    coverImage: z.string().optional(),
    secondaryImage: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
    sections: z.array(sectionSchema).optional(),
    closingImage: caseImageSchema.optional(),
  }),
});

export const collections = { projects };
