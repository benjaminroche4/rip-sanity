import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {media} from 'sanity-plugin-media'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Relocation',

  projectId: 'ks9vwq45',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Relocation In Paris')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.listItem()
                      .title('Articles')
                      .child(S.documentTypeList('blog').title('Articles')),
                    S.listItem()
                      .title('Authors')
                      .child(S.documentTypeList('author').title('Authors')),
                    S.listItem()
                      .title('Categories')
                      .child(S.documentTypeList('category').title('Categories')),
                  ]),
              ),
          ]),
    }),
    visionTool(),
    colorInput(),
    media(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'fr', title: 'Français'},
        {id: 'en', title: 'English'},
      ],
      schemaTypes: ['blog', 'category'],
      weakReferences: true,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
