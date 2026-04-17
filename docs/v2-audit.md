# V2 Audit Digest
Generated: Fri Apr 17 16:59:54 AST 2026
Repos audited: SalesArtsV2, SalesArts, SalesArt-API, ApiWindmarHome

## SalesArtsV2 (target de migración)
### Structure
```
SalesArtsV2
SalesArtsV2/.claude
SalesArtsV2/.claude/launch.json
SalesArtsV2/.claude/settings.local.json
SalesArtsV2/.git
SalesArtsV2/.gitignore
SalesArtsV2/.npmrc
SalesArtsV2/.pnpmfile.cjs
SalesArtsV2/apps
SalesArtsV2/apps/web
SalesArtsV2/apps/web/.gitignore
SalesArtsV2/apps/web/AGENTS.md
SalesArtsV2/apps/web/CLAUDE.md
SalesArtsV2/apps/web/README.md
SalesArtsV2/apps/web/eslint.config.mjs
SalesArtsV2/apps/web/next.config.ts
SalesArtsV2/apps/web/package.json
SalesArtsV2/apps/web/pnpm-lock.yaml
SalesArtsV2/apps/web/postcss.config.mjs
SalesArtsV2/apps/web/public
SalesArtsV2/apps/web/public/file.svg
SalesArtsV2/apps/web/public/globe.svg
SalesArtsV2/apps/web/public/next.svg
SalesArtsV2/apps/web/public/vercel.svg
SalesArtsV2/apps/web/public/window.svg
SalesArtsV2/apps/web/src
SalesArtsV2/apps/web/src/app
SalesArtsV2/apps/web/src/components
SalesArtsV2/apps/web/src/lib
SalesArtsV2/apps/web/src/proxy.ts
SalesArtsV2/apps/web/tsconfig.json
SalesArtsV2/apps/web/vercel.json
SalesArtsV2/apps/worker
SalesArtsV2/apps/worker/.env.example
SalesArtsV2/apps/worker/package.json
SalesArtsV2/apps/worker/src
SalesArtsV2/apps/worker/src/engines
SalesArtsV2/apps/worker/src/index.ts
SalesArtsV2/apps/worker/src/queues
SalesArtsV2/apps/worker/src/zoho
SalesArtsV2/apps/worker/tsconfig.json
SalesArtsV2/package.json
SalesArtsV2/packages
SalesArtsV2/packages/shared
SalesArtsV2/packages/shared/package.json
SalesArtsV2/packages/shared/src
SalesArtsV2/packages/shared/src/database.types.ts
SalesArtsV2/packages/shared/src/design-spec.types.ts
SalesArtsV2/packages/shared/src/index.ts
SalesArtsV2/packages/shared/src/zoho.types.ts
SalesArtsV2/packages/shared/tsconfig.json
SalesArtsV2/pnpm-lock.yaml
SalesArtsV2/pnpm-workspace.yaml
SalesArtsV2/supabase
SalesArtsV2/supabase/migrations
SalesArtsV2/supabase/migrations/001_initial_schema.sql
SalesArtsV2/supabase/migrations/002_seed_templates.sql
SalesArtsV2/supabase/migrations/003_fix_rls_policies.sql
SalesArtsV2/supabase/migrations/004_storage_bucket.sql
```
### package.json
```json
{
  "name": "salesarts-v2",
  "scripts": {
    "dev": "pnpm --filter web dev",
    "dev:worker": "pnpm --filter worker dev",
    "build": "pnpm --filter web build",
    "lint": "pnpm -r lint",
    "type-check": "pnpm -r type-check"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.7.3"
  }
}
```
### Entry
```
```
---
## SalesArts (prod)
### package.json deps
```json
{
  "dependencies": {
    "axios": "1.13.2",
    "globals": "16.5.0",
    "lucide-react": "^0.556.0",
    "motion": "^12.23.25",
    "next": "16.0.8",
    "next-intl": "^4.5.8",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "react-icons": "^5.5.0",
    "socket.io-client": "^4.8.1",
    "sonner": "^2.0.7",
    "typescript-eslint": "8.49.0",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@eslint/eslintrc": "3.3.3",
    "@eslint/js": "^9.39.1",
    "@tailwindcss/postcss": "^4.1.17",
    "@types/node": "24.10.2",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "eslint": "9.39.1",
    "eslint-config-next": "16.0.8",
    "eslint-plugin-react": "^7.37.5",
    "postcss": "8.5.6",
    "prettier": "3.7.4",
    "prettier-plugin-tailwindcss": "0.7.2",
    "tailwindcss": "4.1.17",
    "typescript": "5.9.3"
  }
}
```
### SalesArts/src/hooks/usePlacidEditor.ts
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useRef, useState } from 'react'

// Agregar declaración de tipo para window.EditorSDK
declare global {
  interface Window {
    EditorSDK: {
      canvas: {
        create: (
          element: HTMLDivElement,
          options: {
            access_token: string
            template_uuid: string
          }
        ) => any
      }
    }
  }
}

interface UsePlacidEditorProps {
  templateUuid: string
}

export default function usePlacidEditor({ templateUuid }: UsePlacidEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [canvasInstance, setCanvasInstance] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPlacidSDK = () => {
      const existingScript = document.querySelector('script[src="https://sdk.placid.app/editor-sdk@latest/sdk.js"]')

      if (existingScript) {
        // Asegurémonos de que el SDK está realmente cargado
        if (window.EditorSDK) {
          initPlacid()
        } else {
          // Si existe el script pero EditorSDK no está disponible, esperemos
          existingScript.addEventListener('load', initPlacid)
        }
        return
      }

      const script = document.createElement('script')
      script.src = 'https://sdk.placid.app/editor-sdk@latest/sdk.js'
      script.async = true
      script.onload = initPlacid
      script.onerror = () => {
        if (isMounted) {
          setError('Error al cargar el SDK de Placid')
        }
      }
      document.body.appendChild(script)
    }

    const initPlacid = () => {
      if (!isMounted) return

      if (window.EditorSDK && editorRef.current) {
        try {
          const canvas = window.EditorSDK.canvas.create(editorRef.current, {
            access_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Nzc0NjY3MDEsImlhdCI6MTc0NTkzMDcwMSwic2RrX3Rva2VuIjoicGxhY2lkLWFsMXdjY3MyeDg1cHZuNGYteXhudzZ2aHdyZ3BtZHdycyIsInVzZXIiOm51bGwsInNjb3BlcyI6WyJ0ZW1wbGF0ZXM6cmVhZCJdLCJlZGl0b3Jfb3B0aW9ucyI6eyJlbmFibGVDYW52YXNSZXNpemluZyI6dHJ1ZSwiZW5hYmxlQ2FudmFzVHJhbnNwYXJlbmN5Ijp0cnVlLCJlbmFibGVUZW1wbGF0ZVJlbmFtaW5nIjp0cnVlLCJlbmFibGVCdXR0b25TYXZlIjp0cnVlLCJlbmFibGVCdXR0b25TYXZlQW5kQ2xvc2UiOmZhbHNlfSwidGVtcGxhdGVfb3B0aW9ucyI6W119.ZPhvtAtnbr3I-9sV5U5MReRbrQjdZhJFr4nXqhVfrrE',
            template_uuid: templateUuid
          })

          setCanvasInstance(canvas)
          setError(null)
        } catch (error) {
          console.error('Error al inicializar el editor:', error)
          setError('Error al inicializar el editor Placid')
        }
      } else if (!window.EditorSDK) {
        setError('SDK de Placid no disponible')
      } else if (!editorRef.current) {
        setError('Elemento de referencia no disponible')
      }
    }

    loadPlacidSDK()

    return () => {
      isMounted = false
    }
  }, [templateUuid])

  const updateCanvas = (layerValues: Record<string, { text: string }>) => {
    if (canvasInstance) {
      try {
        canvasInstance.fillLayers(layerValues)
      } catch (error) {
        console.error('Error al actualizar canvas:', error)
      }
    }
  }

  return { editorRef, canvasInstance, updateCanvas, error }
}
```

### SalesArts/src/components/Editor.tsx
```typescript
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'

import { GeneratePlacidImage, GeneratePlacidPDF, GeneratePlacidVideo } from '../lib/client'
import { useUserStore } from '../store/userStore'

import FormField from './editor/FormField'
import TabSelector from './editor/TabSelector'
import ContentOptionsPanel from './editor/ContentOptionsPanel'

import usePlacidEditor from '../hooks/usePlacidEditor'
import { useTranslations } from 'next-intl'

interface Layer {
  name: string
  type: string
}

interface EditorProps {
  layers?: Layer[]
  templateUuid?: string
  tags: string[]
  templateName: string
}

/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    EditorSDK: {
      canvas: {
        create: (
          element: HTMLDivElement,
          options: {
            access_token: string
            template_uuid: string
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) => any
      }
    }
    placid?: {
      canvas?: {
        fillLayers: (layerValues: Record<string, { text: string }>) => void
      }
    }
  }
}
/* eslint-enable no-unused-vars */

export default function Editor({ layers = [], templateUuid = '', tags, templateName }: EditorProps) {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // Get userData from userStore
  const { data } = useUserStore()
  const userData = data?.userData || {}

  const t = useTranslations('editor')

  // Custom hook for Placid editor
  const { editorRef, updateCanvas } = usePlacidEditor({ templateUuid })

  // Parse export options from tags
  const parseExportOptions = () => {
    const defaultOptions = ['Image', 'Video', 'PDF']

    if (!tags || tags.length === 0) return defaultOptions

    const exportTag = tags.find((tag) => tag.startsWith('Export:'))
    if (!exportTag) return defaultOptions

    const options = exportTag
      .substring('Export:'.length)
      .split(',')
      .map((option) => option.trim())
      .filter((option) => ['Image', 'Video', 'PDF'].includes(option))

    return options.length > 0 ? options : defaultOptions
  }

  const availableExportOptions = parseExportOptions()

  // State for text inputs
  const [textInputs, setTextInputs] = useState<Layer[]>([])
  const [layerValues, setLayerValues] = useState<Record<string, { text: string }>>({})

  // State for tabs - initialize with first available export option
  const [activeTab, setActiveTab] = useState<string>(availableExportOptions[0] || 'Image')

  // State for panel
  const [isPanelHidden, setIsPanelHidden] = useState<boolean>(true)

  // State for generation
  const [error, setError] = useState<string | null>(null)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  // Effect to filter text layers and prefill from userData if matches exist
  useEffect(() => {
    const textLayers = layers.filter((layer) => layer.type === 'text')
    setTextInputs(textLayers)

    if (userData && Object.keys(userData).length > 0) {
      const initialValues: Record<string, { text: string }> = {}
      let needsUpdate = false

      textLayers.forEach((layer) => {
        const layerNameLower = layer.name.toLowerCase()

        Object.entries(userData).forEach(([key, value]) => {
          if (key.toLowerCase() === layerNameLower && value && (!layerValues[layer.name] || layerValues[layer.name].text !== String(value))) {
            initialValues[layer.name] = { text: String(value) }
            needsUpdate = true
          }
        })
      })

      if (needsUpdate && Object.keys(initialValues).length > 0) {
        setLayerValues((prev) => ({ ...prev, ...initialValues }))
        updateCanvas(initialValues)
      }
    }
  }, [layers, userData])

  // Effect to validate form
  useEffect(() => {
    if (textInputs.length === 0) return

    const allFieldsFilled = textInputs.every((layer) => layerValues[layer.name]?.text && layerValues[layer.name].text.trim() !== '')

    setIsFormValid(allFieldsFilled)
  }, [textInputs, layerValues])

  const handleInputChange = (layerName: string, formattedValue: string) => {
    const updatedLayerValues = {
      ...layerValues,
      [layerName]: { text: formattedValue }
    }

    setLayerValues(updatedLayerValues)

    updateCanvas(updatedLayerValues)
  }

  // Handler for changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Handler for toggling panel visibility
  const togglePanelVisibility = () => {
    setIsPanelHidden(!isPanelHidden)
  }

  // Handler for generating content
  const handleGenerateContent = async () => {
    if (!isFormValid) {
      toast.error(t('completeAllFields'), {
        description: t('allFieldsRequired'),
        duration: 3000
      })
      return
    }

    setError(null)

    try {
      let result

      switch (activeTab) {
        case 'Image':
          result = await GeneratePlacidImage(templateUuid, templateName, layerValues, id)
          break
        case 'PDF':
          result = await GeneratePlacidPDF(templateUuid, templateName, layerValues, id)
          break
        case 'Video':
          result = await GeneratePlacidVideo(templateUuid, templateName, layerValues, id)
          break
        default:
          throw new Error('Invalid content type')
      }

      if (result.error) {
        throw new Error(result.error.message || 'Error generating content')
      }

      toast.success(t('templateAddedToQueue'), {
        duration: 5000,
        position: 'bottom-right',
        action: {
          label: t('viewHistory'),
          onClick: () => router.push(`./history`)
        }
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('couldNotGenerate', { type: activeTab.toLowerCase() })
      console.error(`Error generating ${activeTab}:`, error)
      setError(errorMessage)

      toast.error(t('errorGenerating', { type: activeTab.toLowerCase() }), {
        description: errorMessage
      })
    }
  }

  return (
    <>
      <div className='@container relative flex h-full w-full items-center justify-center p-4'>
        <div id='canvas' ref={editorRef} className='h-fit w-full @xl:max-w-[500px]'></div>
        <div className='absolute inset-0 md:hidden' onClick={togglePanelVisibility} aria-hidden='true'></div>
      </div>

      {isPanelHidden && (
        <button
          onClick={togglePanelVisibility}
          className='fixed bottom-6 left-1/2 z-20 w-[90%] -translate-x-1/2 transform cursor-pointer rounded-md bg-[#f89b24] p-4 font-bold text-white uppercase shadow-lg transition-all hover:scale-105 md:hidden'
          aria-label={t('openEditor')}
        >
          {t('editTemplate')}
        </button>
      )}

      <div
        className={`fixed right-0 bottom-0 left-0 z-10 max-h-[80vh] w-full overflow-auto rounded-t-3xl bg-white shadow-lg md:relative md:h-full md:max-h-max md:max-w-[500px] md:rounded-none md:shadow-none ${
          isPanelHidden ? 'translate-y-full md:translate-y-0' : 'translate-y-0'
        } transition-transform duration-300 ease-in-out md:transition-none`}
      >
        {textInputs.length > 0 && (
          <div className='flex h-full w-full flex-col gap-2'>
            <div className='flex items-center justify-between px-4 pt-6'>
              <h3 className='text-lg font-semibold text-gray-500'>{templateName || t('templateEditor')}</h3>
            </div>

            <div className='flex h-full flex-col gap-2 p-5 pt-0 md:p-8'>
              <h1 className='w-full rounded-lg py-2 font-bold'>{t('fields')}</h1>

              <div className='flex flex-col gap-2'>
                {textInputs.map((layer) => (
                  <div key={layer.name}>
                    <FormField layer={layer} value={layerValues[layer.name]?.text || ''} onChange={handleInputChange} />
                  </div>
                ))}
              </div>

              <div className='flex flex-1 flex-col gap-2'>
                <h1 className='w-full rounded-lg font-bold'>{t('generateAs')}</h1>

                <div>
                  <TabSelector activeTab={activeTab} onTabChange={handleTabChange} tabs={availableExportOptions} />
                </div>

                <div className='mt-2'>
                  <ContentOptionsPanel activeTab={activeTab} />
                </div>

                {!isFormValid && (
                  <div className='mt-2 rounded border-l-4 border-amber-500 bg-amber-50 p-2 text-sm text-amber-700'>{t('completeAllFields')}</div>
                )}

                {error && <div className='mt-2 rounded border-l-4 border-red-500 bg-red-50 p-2 text-sm text-red-600'>{t('thereWasError')}</div>}
              </div>

              <button
                onClick={handleGenerateContent}
                disabled={!isFormValid}
                title={t('generateTemplate')}
                className='mt-4 w-full cursor-pointer rounded-lg bg-[#f89b24] py-3 font-bold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:opacity-100'
              >
                {t('generate', { type: activeTab })}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
```

### SalesArts/src/components/ExplorerPlacid/Explorer.tsx
```typescript
'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import ExplorerItem from './ExplorerItem'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslations } from 'next-intl'

type Layers = {
  name: string
  type: string
}

type File = {
  uuid: string
  title: string
  thumbnail: string
  tags: string[]
  width: number
  height: number
  layers: Layers[]
}

type PropsType = {
  files?: File[]
  region?: 'PR' | 'FL'
}

type ActiveFilters = {
  [key: string]: string | null
}

function PlacidExplorer({ files = [] }: PropsType) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const t = useTranslations('explorer')

  const filterTypes = useMemo(() => {
    const types = new Set<string>()

    files.forEach((file) => {
      file.tags.forEach((tag) => {
        if (tag.includes('/')) {
          const type = tag.split('/')[0]
          types.add(type)
        }
      })
    })

    return Array.from(types)
  }, [files])

  const filterValues = useMemo(() => {
    const result: { [key: string]: string[] } = {}

    filterTypes.forEach((type) => {
      const values = new Set<string>()

      files.forEach((file) => {
        file.tags.forEach((tag) => {
          if (tag.startsWith(`${type}/`)) {
            const value = tag.split('/')[1]
            values.add(value)
          }
        })
      })

      result[type] = Array.from(values)
    })

    return result
  }, [files, filterTypes])

  const filteredFiles = useMemo(() => {
    const activeFilterEntries = Object.entries(activeFilters).filter(([, value]) => value !== null)

    if (activeFilterEntries.length === 0) {
      return files
    }

    return files.filter((file) => {
      return activeFilterEntries.every(([type, value]) => {
        return file.tags.some((tag) => tag === `${type}/${value}`)
      })
    })
  }, [files, activeFilters])

  const handleFilterValueClick = (type: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }

      if (newFilters[type] === value) {
        newFilters[type] = null
      } else {
        newFilters[type] = value
      }

      if (newFilters[type] === null) {
        delete newFilters[type]
      }

      return newFilters
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({})
  }

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev)
  }

  const toggleDropdown = (type: string) => {
    setOpenDropdown(openDropdown === type ? null : type)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown !== null) {
        const currentRef = dropdownRefs.current[openDropdown]
        if (currentRef && !currentRef.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  return (
    <div className='mb-20 flex h-full w-full flex-col gap-4 md:mb-0'>
      <div className='flex flex-wrap items-center gap-1 font-semibold'>
        <span className='cursor-pointer truncate rounded-full p-2' onClick={clearAllFilters}>
          {t('allTemplates')}
          <div className='h-0.5 w-full rounded-full bg-black'></div>
        </span>

        {Object.entries(activeFilters).map(([type, value]) => (
          <span key={`${type}-${value}`} className='hidden items-center md:flex'>
            <span className='mx-2'>|</span>
            <span className='cursor-pointer truncate rounded-full p-2' onClick={() => handleFilterValueClick(type, value || '')}>
              <span className='mr-1 text-gray-500'>{type}:</span> {value}
              <div className='h-0.5 w-full rounded-full'></div>
            </span>
          </span>
        ))}

        <div className='ml-auto hidden items-center gap-2 md:flex'>
          <span>{t('filters')}</span>
          {filterTypes.map((type) => (
            <div
              key={type}
              className='relative'
              ref={(el) => {
                dropdownRefs.current[type] = el
              }}
            >
              <button
                onClick={() => toggleDropdown(type)}
                className={`flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-sm ${
                  activeFilters[type] ? 'bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {type}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className={`h-4 w-4 transition-transform ${openDropdown === type ? 'rotate-180' : ''}`}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>

              <AnimatePresence>
                {openDropdown === type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute top-full z-10 mt-1 w-48 overflow-hidden rounded-md bg-white shadow-lg'
                  >
                    <div className='max-h-60 overflow-y-auto py-2'>
                      {filterValues[type]?.map((value) => (
                        <button
                          key={value}
                          onClick={() => {
                            handleFilterValueClick(type, value)
                            setOpenDropdown(null)
                          }}
                          className={`w-full px-4 py-2 text-left text-sm ${
                            activeFilters[type] === value ? 'bg-black font-medium text-white' : 'hover:bg-slate-50'
                          }`}
                        >
                          {value}
                          {activeFilters[type] === value && <span className='ml-2'>✓</span>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {Object.keys(activeFilters).length > 0 && (
            <button
              onClick={clearAllFilters}
              className='flex cursor-pointer items-center rounded-full bg-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-200'
            >
              {t('clearAll')} ({Object.keys(activeFilters).length})
            </button>
          )}
        </div>

        <button
          onClick={toggleFilterModal}
          className='ml-auto flex cursor-pointer items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200 md:hidden'
        >
          {t('filters')}
          {Object.keys(activeFilters).length > 0 && (
            <span className='flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white'>
              {Object.keys(activeFilters).length}
            </span>
          )}
          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
            />
          </svg>
        </button>
      </div>

      <div className='flex w-full'>
        <div className='relative w-full columns-1 gap-6 lg:columns-[350px]'>
          <AnimatePresence initial={false}>
            {filteredFiles.map((file) => (
              <motion.div
                key={file.uuid}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  opacity: { duration: 0.3 },
                  layout: { type: 'spring', bounce: 0.2, duration: 0.5 }
                }}
                style={{ breakInside: 'avoid', marginBottom: '24px' }}
              >
                <ExplorerItem
                  Key={file.uuid}
                  Name={file.title}
                  Tags={file.tags}
                  Img={file.thumbnail}
                  Width={file.width}
                  Height={file.height}
                  Layers={file.layers}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isFilterModalOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) toggleFilterModal()
            }}
          >
            <motion.div
              className='w-full max-w-md rounded-xl bg-white p-6 shadow-lg'
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>
                  {t('filters')}
                  {Object.keys(activeFilters).length > 0 && (
                    <span className='ml-2 text-sm text-gray-500'>
                      ({Object.keys(activeFilters).length} {t('activeFilters')})
                    </span>
                  )}
                </h3>
                <button onClick={toggleFilterModal} className='cursor-pointer rounded-full bg-slate-100 p-2 hover:bg-slate-200'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              <div className='max-h-[60vh] overflow-y-auto'>
                {filterTypes.map((type) => (
                  <div key={type} className='mb-4 flex flex-col gap-1'>
                    <div className='flex items-center justify-between font-semibold'>{type}</div>
                    <div className='flex flex-wrap gap-2'>
                      {filterValues[type]?.map((value) => (
                        <span
                          className={`cursor-pointer rounded-full px-3 py-1 text-sm ${
                            activeFilters[type] === value ? 'bg-black text-white' : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                          onClick={() => handleFilterValueClick(type, value)}
                          key={value}
                        >
                          {value}
                          {activeFilters[type] === value && <span className='ml-1'>✓</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-4 flex justify-between'>
                <button
                  onClick={clearAllFilters}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm text-gray-600 hover:underline ${
                    Object.keys(activeFilters).length === 0 ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={Object.keys(activeFilters).length === 0}
                >
                  {t('clearAll')}
                </button>
                <button onClick={toggleFilterModal} className='cursor-pointer rounded-full bg-black px-4 py-2 text-sm text-white hover:opacity-95'>
                  {t('applyFilters')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PlacidExplorer
```

### SalesArts/src/components/NotificationSocket.tsx
```typescript
'use client'

import { toast } from 'sonner'
import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function NotificationSocket() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const t = useTranslations('notifications')

  useEffect(() => {
    const socketInstance = getSocket(id)

    // Logs Connection
    // if (!socketInstance.hasListeners('connection_established')) {
    //   socketInstance.on('connection_established', (data) => {
    //     console.debug('Connection established:', data)
    //     toast.success(`Connection established: ${JSON.stringify(data)}`)
    //   })
    // }

    if (!socketInstance.hasListeners('placid_notification')) {
      socketInstance.on('placid_notification', (data) => {
        console.debug('Placid notification received:', data)
        toast.success(t('templateReady'), {
          duration: 5000,
          position: 'bottom-right',
          action: {
            label: t('viewHistory'),
            onClick: () => router.push(`./history`)
          }
        })
      })
    }

    // Logs Error
    // if (!socketInstance.hasListeners('connect_error')) {
    //   socketInstance.on('connect_error', (err) => {
    //     console.error('Connection error:', err)
    //     toast.error(t('connectionError', { message: err.message }))
    //   })
    // }

    // Logs Disconnect
    // if (!socketInstance.hasListeners('disconnect')) {
    //   socketInstance.on('disconnect', (reason) => {
    //     console.debug('Disconnected:', reason)
    //     toast.error(t('disconnected', { reason }))
    //   })
    // }

    return () => {}
  }, [id, t])

  return <></>
}
```

### SalesArts/src/lib/client.ts
```typescript
'use client'

import axios from 'axios'

const salesArtBaseURL = process.env.NEXT_PUBLIC_API_URL_SA
const apiKey = process.env.NEXT_PUBLIC_API_KEY

const salesArtAPI = axios.create({
  baseURL: salesArtBaseURL
})

salesArtAPI.interceptors.request.use((config) => {
  config.headers['x-api-key'] = apiKey
  // config.headers['x-request-id'] = salesTeam?.id
  return config
})

export const downloadFile = async (fileName: string, clientName: string) => {
  try {
    const response = await fetch(`${salesArtBaseURL}/documents/file/${fileName}?x-api-key=${apiKey}`)

    if (!response.ok) {
      throw new Error('Error al descargar el archivo')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = clientName
    document.body.appendChild(link)
    link.click()

    // Limpieza
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error durante la descarga:', error)
  }
}

export const downloadFromUrl = async (url: string, fileName: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Error al descargar el contenido')
    }

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()

    document.body.removeChild(downloadLink)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100)

    return true
  } catch (err) {
    console.error('Error al descargar el archivo:', err)
    return false
  }
}

export async function GeneratePlacidImage(templateUuid: string, templateName: string, layers: Record<string, { text: string }>, id: string) {
  try {
    console.debug('Generating image from Placid through API')

    const res = await salesArtAPI.post(`/templates/generate/images/${id}`, {
      webhook_success: `${salesArtBaseURL}/templates/webhook/${id}?x-api-key=${apiKey}`,
      template_uuid: templateUuid,
      template_name: templateName,
      layers: layers
    })

    if (res.data.isError) {
      return { error: { message: res.data.message || 'Error generando la imagen' } }
    }

    return res.data.data
  } catch (error) {
    console.error('Failed to generate image:', error)
    return { error }
  }
}

export async function GeneratePlacidPDF(templateUuid: string, templateName: string, layers: Record<string, { text: string }>, id: string) {
  try {
    console.debug('Generating PDF from Placid through API')

    const res = await salesArtAPI.post(`/templates/generate/pdfs/${id}`, {
      webhook_success: `${salesArtBaseURL}/templates/webhook/${id}?x-api-key=${apiKey}`,
      template_name: templateName,
      pages: [
        {
          template_uuid: templateUuid,
          layers: layers
        }
      ]
    })

    if (res.data.isError) {
      return { error: { message: res.data.message || 'Error generando el PDF' } }
    }

    return res.data.data
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    return { error }
  }
}

export async function GeneratePlacidVideo(templateUuid: string, templateName: string, layers: Record<string, { text: string }>, id: string) {
  try {
    console.debug('Generating video from Placid through API')

    const res = await salesArtAPI.post(`/templates/generate/videos/${id}`, {
      webhook_success: `${salesArtBaseURL}/templates/webhook/${id}?x-api-key=${apiKey}`,
      template_name: templateName,
      clips: [
        {
          template_uuid: templateUuid,
          layers: layers
        }
      ]
    })

    if (res.data.isError) {
      return { error: { message: res.data.message || 'Error generando el video' } }
    }

    return res.data.data
  } catch (error) {
    console.error('Failed to generate video:', error)
    return { error }
  }
}
```

### Routes
SalesArts/src/app/[region]/[id]/arts/loading.tsx
SalesArts/src/app/[region]/[id]/arts/page.tsx
SalesArts/src/app/[region]/[id]/enterprise/loading.tsx
SalesArts/src/app/[region]/[id]/enterprise/page.tsx
SalesArts/src/app/[region]/[id]/history/loading.tsx
SalesArts/src/app/[region]/[id]/history/page.tsx
SalesArts/src/app/[region]/[id]/layout.tsx
SalesArts/src/app/[region]/[id]/loading.tsx
SalesArts/src/app/[region]/[id]/my-docs/loading.tsx
SalesArts/src/app/[region]/[id]/my-docs/page.tsx
SalesArts/src/app/[region]/[id]/page.tsx
SalesArts/src/app/[region]/[id]/settings/loading.tsx
SalesArts/src/app/[region]/[id]/settings/page.tsx
SalesArts/src/app/[region]/[id]/videos/loading.tsx
SalesArts/src/app/[region]/[id]/videos/page.tsx
SalesArts/src/app/[region]/page.tsx
SalesArts/src/app/layout.tsx
SalesArts/src/app/page.tsx
---
## SalesArt-API (backend)
### SalesArt-API/src/templates/templates.controller.ts
```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { PlacidQueueDto } from './dto/placid-queue.dto'

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get(':region')
  findAll(@Param('region') region: 'PR' | 'FL') {
    return this.templatesService.findAll(region)
  }

  @Post('generate/:type/:userId')
  create(@Param('type') type: string, @Param('userId') userId: string, @Body() createTemplateDto: object) {
    return this.templatesService.generate(createTemplateDto, type, userId)
  }

  @Post('webhook/:id')
  recive(@Param('id') id: string, @Body() webhook: PlacidQueueDto) {
    return this.templatesService.webhook(webhook, id)
  }
}
```

### SalesArt-API/src/templates/templates.service.ts
```typescript
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WebsocketService } from 'src/websocket/websocket.service'
import { PlacidQueueDto } from './dto/placid-queue.dto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

import axios from 'axios'

@Injectable()
export class TemplatesService {
  private readonly placidApiKey: string
  private readonly placidApiUrl: string
  private readonly dynamoClient: DynamoDBDocumentClient

  constructor(
    private configService: ConfigService,
    private readonly websocketService: WebsocketService
  ) {
    this.placidApiKey = this.configService.get<string>('PLACID_API_KEY')
    this.placidApiUrl = 'https://api.placid.app/api/rest'

    const client = new DynamoDBClient({
      region: this.configService.get<string>('DYNAMO_BUCKET_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('DYNAMO_PUBLIC_KEY') || '',
        secretAccessKey: this.configService.get<string>('DYNAMO_SECRET_KEY') || ''
      }
    })

    this.dynamoClient = DynamoDBDocumentClient.from(client)
  }

  async generate(data: any, type: string, userId: string) {
    let templateId: string
    let layerValues: Record<string, any>
    let templateName: string

    switch (type) {
      case 'images':
        templateName = data.template_name
        templateId = data.template_uuid
        layerValues = data.layers
        break
      case 'pdfs':
        if (!data.pages || data.pages.length === 0) {
          throw new Error('PDF data must include at least one page')
        }
        templateName = data.template_name
        templateId = data.pages[0].template_uuid
        layerValues = data.pages[0].layers
        break
      case 'videos':
        if (!data.clips || data.clips.length === 0) {
          throw new Error('Video data must include at least one clip')
        }
        templateName = data.template_name
        templateId = data.clips[0].template_uuid
        layerValues = data.clips[0].layers
        break
      default:
        throw new Error(`Unsupported media type: ${type}`)
    }

    const response = await axios
      .post(`${this.placidApiUrl}/${type}`, data, {
        headers: {
          Authorization: `Bearer ${this.placidApiKey}`
        }
      })
      .then((res) => res.data)
      .catch((error) => {
        console.error('Error generating template:', error)
        throw new Error(`Error generating template: ${error.message}`)
      })

    await this.addTemplateToUserHistory(userId, templateId, templateName, response, layerValues)

    return {
      message: `Template ${type} add to queue`,
      data: {
        ...response
      }
    }
  }

  async findAll(region: 'PR' | 'FL') {
    console.log('Getting all templates')

    let url = `${this.placidApiUrl}/templates/`
    let allTemplates: any[] = []

    while (url) {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.placidApiKey}`
        }
      })

      const data = res.data
      const templatesArray = data && data.data && Array.isArray(data.data) ? data.data : []
      allTemplates = allTemplates.concat(templatesArray)

      url = data.links && data.links.next ? data.links.next : null
    }

    const filterData = allTemplates
      .filter(
        (file: { tags: string[] }) =>
          Array.isArray(file.tags) &&
          file.tags.some((tag) => tag?.toLowerCase?.().includes('active')) &&
          file.tags.some((tag) => tag?.toLowerCase?.().includes(region.toLowerCase()))
      )
      .map((file: any) => ({
        ...file,
        tags: file.tags.filter((tag: string) => !tag?.toLowerCase?.().includes(region.toLowerCase()))
      }))

    console.log(JSON.stringify(filterData))

    return filterData
  }

  async addTemplateToUserHistory(zohoId: string, templateId: string, templateName: string, fileData: any, layerValues: Record<string, any>) {
    try {
      console.log('Adding template to user history:\n', JSON.stringify({ zohoId, templateId, templateName, fileData, layerValues }))

      const metaData = Object.entries(layerValues).reduce(
        (acc, [key, value]) => {
          if (typeof value === 'object' && value !== null && 'text' in value) {
            acc[key] = value.text
          } else {
            acc[key] = String(value)
          }
          return acc
        },
        {} as Record<string, string>
      )

      const historyItem = {
        templateId: templateId,
        templateName: templateName,
        fileURL: fileData.image_url || fileData.pdf_url || fileData.video_url || '',
        exportDate: new Date().toISOString(),
        status: fileData.status || 'queued',
        metaData,
        type: fileData.type || 'image',
        placidId: fileData.id?.toString()
      }

      const getCommand = new GetCommand({
        TableName: 'User',
        Key: { zohoId }
      })

      const existingUser = await this.dynamoClient.send(getCommand)

      if (!existingUser.Item) {
        throw new Error(`User with zohoId ${zohoId} does not exist in the database`)
      }

      const existingUserData = existingUser.Item.userData || {}
      const updatedUserData = { ...existingUserData, ...metaData }

      let updateExpression: string
      let expressionAttributeValues: any

      if (!existingUser.Item.filesHistory) {
        updateExpression = 'SET filesHistory = :history, userData = :userData'
        expressionAttributeValues = {
          ':history': [historyItem],
          ':userData': updatedUserData
        }
      } else {
        updateExpression = 'SET filesHistory = list_append(filesHistory, :history), userData = :userData'
        expressionAttributeValues = {
          ':history': [historyItem],
          ':userData': updatedUserData
        }
      }

      const updateCommand = new UpdateCommand({
        TableName: 'User',
        Key: { zohoId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      })

      const result = await this.dynamoClient.send(updateCommand)

      console.log('Successfully added template to user history and updated userData:\n', JSON.stringify({ zohoId, templateId }))
      return result.Attributes
    } catch (error) {
      console.error('Error updating user history and userData:', error)
      throw error
    }
  }

  async updateUserFileStatus(userId: string, placidId: string, status: string, imageUrl: string | null): Promise<boolean> {
    try {
      const getUserResult = await this.dynamoClient.send(
        new GetCommand({
          TableName: 'User',
          Key: { zohoId: userId }
        })
      )

      const user = getUserResult.Item
      if (!user) {
        console.error(`Usuario ${userId} no encontrado en la base de datos`)
        return false
      }

      const fileIndex = user.filesHistory.findIndex((file) => file.placidId === placidId)

      if (fileIndex === -1) {
        console.error(`No se encontró el archivo con placidId: ${placidId} para usuario ${userId}`)
        return false
      }

      await this.dynamoClient.send(
        new UpdateCommand({
          TableName: 'User',
          Key: { zohoId: userId },
          UpdateExpression: 'SET #files[' + fileIndex + '].#status = :status, #files[' + fileIndex + '].#fileURL = :fileURL',
          ExpressionAttributeNames: {
            '#files': 'filesHistory',
            '#status': 'status',
            '#fileURL': 'fileURL'
          },
          ExpressionAttributeValues: {
            ':status': status,
            ':fileURL': imageUrl || user.filesHistory[fileIndex].fileURL
          }
        })
      )

      console.log(`Actualizado estado del archivo placidId: ${placidId} para usuario ${userId}`)
      return true
    } catch (error) {
      console.error(`Error al actualizar la base de datos: ${error.message}`)
      return false
    }
  }

  async webhook(webhook: PlacidQueueDto, id: string) {
    console.log('Webhook received:\n', JSON.stringify(webhook))

    await this.updateUserFileStatus(id, webhook.id.toString(), webhook.status, webhook.image_url || webhook.video_url || webhook.pdf_url || null)

    this.websocketService.sendToUser(id, 'placid_notification', {
      message: 'Webhook received',
      data: { webhook }
    })

    return {
      message: `${id}: Template ${webhook.id} add to queue`,
      data: { ...webhook }
    }
  }
}
```

### SalesArt-API/src/templates/dto/placid-queue.dto.ts
```typescript
import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator'

export class PlacidQueueDto {
  @IsNumber()
  id: number

  @IsString()
  type: string

  @IsString()
  status: string

  @IsOptional()
  @IsString()
  image_url?: string | null

  @IsOptional()
  @IsString()
  video_url?: string | null

  @IsOptional()
  @IsString()
  pdf_url?: string | null

  @IsOptional()
  @IsString()
  transfer_url?: string | null

  @IsOptional()
  @IsString()
  polling_url?: string

  @IsOptional()
  @IsString()
  passthrough?: string | null

  @IsOptional()
  @IsArray()
  errors?: any[]
}
```

### Env vars
SalesArt-API/src/main.ts:  await app.listen(process.env.PORT ?? 3000)
---
## ApiWindmarHome (shared layer)
### ApiWindmarHome/src/controllers/v1/files/placid/getFile.mjs
```javascript
import axios from "axios"
import { respond, ServerError } from "../../../../utils/index.mjs"
import dotenv from "dotenv"
dotenv.config()

const getFile = async (req, res) => {
    const urlBase = "https://api.placid.app/api/rest"

    const response = await axios
        .post(`${urlBase}/${req.params.file}`, req.body, {
            headers: {
                Authorization: `Bearer ${process.env.PLACID_API_KEY}`
            }
        })
        .then((res) => res.data)
        .catch((err) => {
            throw new ServerError(`${(err?.message || `Unknown error in Placid`) + ": " + err?.code}`, err?.status)
        })

    let fileInfo
    let retries = 1
    let timeout = 2000

    do {
        await new Promise((r) => setTimeout(r, timeout))

        fileInfo = await axios
            .get(`${urlBase}/${req.params.file}/${response.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.PLACID_API_KEY}`
                }
            })
            .then((res) => res.data)

        if (fileInfo.status === "finished") break

        retries++
        timeout *= 1.2
    } while (retries < 6)

    if (fileInfo.status !== "finished") throw new ServerError("File not ready", 500)

    return respond({
        res,
        req,
        statusCode: 200,
        data: fileInfo,
        message: "File retrieved successfully"
    })
}

export default getFile
```

### ApiWindmarHome/src/controllers/v1/files/index.mjs
```javascript
import { catchErrorsAsync } from "../../../utils/index.mjs"
import uploadFile from "./aws/uploadFile.mjs"
import getFileAWS from "./aws/getFile.mjs"
import listFiles from "./aws/listFiles.mjs"
import getFilePlacid from "./placid/getFile.mjs"
import getFileCRM from "./crm/getFile.mjs"

const filesControllers = {
    aws: {
        uploadFile: catchErrorsAsync(uploadFile),
        getFile: catchErrorsAsync(getFileAWS),
        listFiles: catchErrorsAsync(listFiles)
    },
    placid: {
        getFile: catchErrorsAsync(getFilePlacid)
    },
    crm: {
        getFile: catchErrorsAsync(getFileCRM)
    }
}

export default filesControllers
```

### ApiWindmarHome/src/routes/v1/files.mjs
```javascript
import Router from "express"
const router = Router()

// middlewares
import { uploadsMiddleware } from "../../middlewares/index.mjs"

// controllers
import filesControllers from "../../controllers/v1/files/index.mjs"

// routes
router.get("/buckets/sales-arts/list-files", filesControllers.aws.listFiles)

router.get("/buckets/sales-arts/file", filesControllers.aws.getFile)

router.post("/placid/:file", filesControllers.placid.getFile)

router.get("/crm/:fileId", filesControllers.crm.getFile)

// router.post("/",
//     uploadsMiddleware({
//         destination: 'resources/s3Objects/',
//         field: 'File'
//     }),
//     filesControllers.aws.uploadFile
// )

export default router
```

### Auth files
ApiWindmarHome/src/middlewares/auth.mjs
ApiWindmarHome/src/controllers/v1/auth
ApiWindmarHome/src/routes/v1/auth.mjs
