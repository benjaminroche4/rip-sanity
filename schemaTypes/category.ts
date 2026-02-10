import {defineType, defineField} from 'sanity'
import {StringWithCounter} from '../components/StringWithCounter'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      description: 'Enter the name of the category. It should be a brief, descriptive title (max 25 characters).',
      validation: (rule) => rule.required().max(25),
      components: {input: StringWithCounter},
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'color',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      language: 'language',
    },
    prepare({title, language}) {
      const lang = language ? language.toUpperCase() : ''
      return {
        title: title || 'Untitled',
        subtitle: lang,
      }
    },
  },
})