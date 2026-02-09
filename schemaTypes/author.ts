import {defineType, defineField} from 'sanity'
import {StringWithCounter} from '../components/StringWithCounter'
import {createImageWithMaxSize} from '../components/ImageWithMaxSize'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      description: 'Enter the full name of the author (max 40 characters).',
      validation: (rule) => rule.required().max(40),
      components: {input: StringWithCounter},
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'fullName',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Use the primary email address by default.',
      initialValue: 'contact@relocation-in-paris.fr',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      description: 'WebP only, max 100 KB. Recommended: 400×400 px (10–50 KB).',
      options: {
        hotspot: true,
        accept: 'image/webp',
      },
      components: {input: createImageWithMaxSize(100)},
      validation: (rule) =>
        rule.required().assetRequired().custom((image) => {
          if (!image?.asset?._ref) return true
          const ref = image.asset._ref
          if (!ref.includes('-webp')) {
            return 'Only WebP format is accepted.'
          }
          return true
        }),
    }),
  ],
})