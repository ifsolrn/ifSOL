'use client'
import {languageFilter} from '@sanity/language-filter'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'


export default defineConfig({
  basePath: '/ifSOL/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    languageFilter({
      supportedLanguages: [
        {id: 'nb', title: 'Norwegian (Bokmål)'},
        {id: 'nn', title: 'Norwegian (Nynorsk)'},
        {id: 'en', title: 'English'},
        {id: 'es', title: 'Spanish'},
        {id: 'arb', title: 'Arabic'},
        {id: 'pt', title: 'Portuguese'},
      ],
      defaultLanguages: ['pt']
    })
  ],
})
