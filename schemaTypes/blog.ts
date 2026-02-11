import {defineType, defineField, defineArrayMember} from 'sanity'
import {StringWithCounter} from '../components/StringWithCounter'
import {createImageWithMaxSize} from '../components/ImageWithMaxSize'
import {NumberWithSuffix} from '../components/NumberWithSuffix'

export const blog = defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fieldsets: [
    {
      name: 'seo',
      title: 'SEO',
      options: {collapsed: false},
    },
    {
      name: 'dates',
      title: 'Dates',
    },
  ],
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Enter the title of the article. This should be a short and descriptive title (maximum 60 characters).',
      validation: (rule) => rule.required().max(60),
      components: {input: StringWithCounter},
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'A brief summary shown below the title to give readers a quick overview of the article (maximum 160 characters).',
      validation: (rule) => rule.required().max(160),
      components: {input: StringWithCounter},
    }),
    defineField({
      name: 'mainPhoto',
      title: 'Main Photo',
      type: 'image',
      description: 'WebP only, max 300 KB.',
      options: {
        hotspot: true,
        accept: 'image/webp',
      },
      components: {input: createImageWithMaxSize(300)},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) =>
        rule.required().custom((image) => {
          if (!image?.asset?._ref) return true
          const ref = image.asset._ref
          if (!ref.includes('-webp')) {
            return 'Only WebP format is accepted.'
          }
          return true
        }),
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'author'}]}],
      validation: (rule) => rule.required().unique(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'number',
      description: 'Estimated reading time for this article.',
      validation: (rule) => rule.required().integer().positive(),
      components: {input: NumberWithSuffix},
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'The main content of the article. Each article must include at least one internal link (to another page on the site) and one external link (to a relevant third-party source) to optimize SEO.',
      validation: (rule) => rule.required(),
      of: [
        defineArrayMember({
          name: 'wysiwygBlock',
          title: 'WYSIWYG Block',
          type: 'object',
          fieldsets: [
            {
              name: 'wysiwygBlock',
              title: 'WYSIWYG Block',
            },
          ],
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'This will be the block title, rendered as an H2.',
              validation: (rule) => rule.required(),
              fieldset: 'wysiwygBlock',
            }),
            defineField({
              name: 'background',
              title: 'Background',
              type: 'boolean',
              description: 'Enable a background color on this block.',
              initialValue: false,
              fieldset: 'wysiwygBlock',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              validation: (rule) => rule.required(),
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'H3', value: 'h3'},
                    {title: 'H4', value: 'h4'},
                    {title: 'Quote', value: 'blockquote'},
                  ],
                },
                {
                  type: 'image',
                  options: {hotspot: true, accept: 'image/webp'},
                  fields: [
                    defineField({
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  components: {input: createImageWithMaxSize(300)},
                },
                {
                  name: 'youtube',
                  title: 'YouTube Video',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'url',
                      title: 'YouTube URL',
                      type: 'url',
                      description: 'e.g. https://www.youtube.com/watch?v=xxx',
                      validation: (rule) =>
                        rule.required().uri({scheme: ['https']}).custom((url) => {
                          if (!url) return true
                          const pattern = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/
                          if (!pattern.test(url)) {
                            return 'Please enter a valid YouTube URL.'
                          }
                          return true
                        }),
                    }),
                    defineField({
                      name: 'shortDescription',
                      title: 'Short Description',
                      type: 'string',
                      description: 'A short description displayed below the video (maximum 250 characters).',
                      validation: (rule) => rule.max(250),
                      components: {input: StringWithCounter},
                    }),
                  ],
                  preview: {
                    select: {url: 'url'},
                    prepare({url}) {
                      return {
                        title: 'YouTube Video',
                        subtitle: url || 'No URL',
                      }
                    },
                  },
                },
              ],
              fieldset: 'wysiwygBlock',
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {
                title: 'WYSIWYG Block',
                subtitle: `Title: ${title || 'Untitled'}`,
              }
            },
          },
        }),
        defineArrayMember({
          name: 'faqBlock',
          title: 'FAQ Block',
          type: 'object',
          fieldsets: [
            {
              name: 'faqBlock',
              title: 'FAQ Block',
            },
          ],
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'This will be the block title, rendered as an H2.',
              initialValue: 'FAQ',
              validation: (rule) => rule.required(),
              fieldset: 'faqBlock',
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              validation: (rule) => rule.required().min(1),
              fieldset: 'faqBlock',
              of: [
                defineArrayMember({
                  type: 'object',
                  options: {modal: {type: 'popover'}},
                  fields: [
                    defineField({
                      name: 'question',
                      title: 'Question',
                      type: 'string',
                      validation: (rule) => rule.required().min(10),
                    }),
                    defineField({
                      name: 'answer',
                      title: 'Answer',
                      type: 'text',
                      validation: (rule) => rule.required().min(10),
                    }),
                  ],
                  preview: {
                    select: {title: 'question'},
                    prepare({title}) {
                      return {title: title || 'Untitled question'}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {
                title: 'FAQ Block',
                subtitle: `Title: ${title || 'Untitled'}`,
              }
            },
          },
        }),
        defineArrayMember({
          name: 'ctaBlock',
          title: 'CTA Block',
          type: 'object',
          fieldsets: [
            {
              name: 'ctaBlock',
              title: 'CTA Block',
            },
          ],
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'This will be the block title, rendered as an H2.',
              initialValue: 'Vous souhaitez vous installer à Paris ?',
              validation: (rule) => rule.required().max(60),
              components: {input: StringWithCounter},
              fieldset: 'ctaBlock',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              initialValue: 'Bénéficiez d\'un accompagnement sur mesure pour vous installer à Paris sereinement.',
              validation: (rule) => rule.required().max(120),
              components: {input: StringWithCounter},
              fieldset: 'ctaBlock',
            }),
            defineField({
              name: 'btnText',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Contacter un expert',
              validation: (rule) => rule.required().max(40),
              components: {input: StringWithCounter},
              fieldset: 'ctaBlock',
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {
                title: 'CTA Block',
                subtitle: `Title: ${title || 'Untitled'}`,
              }
            },
          },
        }),
        defineArrayMember({
          name: 'quickAnswerBlock',
          title: 'Quick Answer Block',
          type: 'object',
          fieldsets: [
            {
              name: 'quickAnswerBlock',
              title: 'Quick Answer Block',
            },
          ],
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'This will be the block title, rendered as an H2.',
              initialValue: 'Réponse rapide',
              validation: (rule) => rule.required().max(60),
              components: {input: StringWithCounter},
              fieldset: 'quickAnswerBlock',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              validation: (rule) => rule.required(),
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'H3', value: 'h3'},
                    {title: 'H4', value: 'h4'},
                    {title: 'Quote', value: 'blockquote'},
                  ],
                },
              ],
              fieldset: 'quickAnswerBlock',
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {
                title: 'Quick Answer Block',
                subtitle: `Title: ${title || 'Untitled'}`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'This will be the URL path for the article. It is generated automatically based on the title, but you can edit it if needed.',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
      fieldset: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'This text appears below your link in Google search results. Write a compelling summary that encourages users to click (maximum 150 characters).',
      validation: (rule) => rule.required().max(150),
      components: {input: StringWithCounter},
      fieldset: 'seo',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'SEO keywords related to the article. Press Enter to add a tag (e.g. "relocation", "paris", "expatriation").',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      fieldset: 'seo',
    }),
    defineField({
      name: 'createdAt',
      title: 'Creation Date',
      type: 'datetime',
      description: 'This is the date when the article was created. It is automatically set.',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
      fieldset: 'dates',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Public Date',
      type: 'datetime',
      description: 'Use this to override the creation date if the article has been updated or republished at a more recent date.',
      fieldset: 'dates',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainPhoto',
      category: 'category.name',
      language: 'language',
    },
    prepare({title, media, category, language}) {
      const lang = language ? language.toUpperCase() : ''
      const subtitle = [category || 'No category', lang].filter(Boolean).join(' · ')
      return {
        title: title || 'Untitled',
        subtitle,
        media,
      }
    },
  },
})