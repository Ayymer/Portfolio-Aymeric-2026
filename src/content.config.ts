import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/projects' }),
  schema: ({ image }) => {
    const sectionSchema = z.discriminatedUnion('type', [
      z.object({
        type: z.literal('brief'),
        heading: z.string(),
        content: z.string(),
        image: image().optional(),
      }),
      z.object({
        type: z.literal('two-column'),
        heading: z.string().optional(),
        highlight: z.string().optional(),
        detail: z.string(),
        image: image().optional(),
      }),
      z.object({
        type: z.literal('image-only'),
        image: image().optional(),
      }),
    ]);

    return z.object({
      title: z.string(),
      year: z.number(),
      services: z.array(z.string()),
      coverImage: image().optional(),
      secondaryImage: image().optional(),
      description: z.string().optional(),
      order: z.number().optional(),
      sections: z.array(sectionSchema).optional(),
      closingImage: image().optional(),
    });
  },
});

export const collections = { projects };
