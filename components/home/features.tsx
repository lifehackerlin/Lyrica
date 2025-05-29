'use client'

import { PenTool, Zap, Download, Palette } from 'lucide-react'

const features = [
  {
    name: 'Multiple Writing Styles',
    description:
      'Choose from 7 different writing modes including Standard, Formal, Academic, Expanded, Summary, Narrative, and Creative styles to match your needs.',
    icon: Palette,
  },
  {
    name: 'Real-time Streaming',
    description:
      'Watch your text being rewritten in real-time with our advanced streaming technology. See the AI craft your content word by word.',
    icon: Zap,
  },
  {
    name: 'Instant Downloads',
    description:
      'Export your rewritten content as PDF or Word documents with one click. Perfect for professional presentations and reports.',
    icon: Download,
  },
  {
    name: 'Smart Auto-Rewrite',
    description:
      'Automatically detects when you paste long text and intelligently suggests the best rewriting mode for your content.',
    icon: PenTool,
  },
]

export default function Features() {
  return (
    <div id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Advanced AI Rewriting</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to transform your writing
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Lyrica.ai combines cutting-edge AI technology with intuitive design to provide the most powerful text rewriting experience available.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon aria-hidden="true" className="h-6 w-6 text-primary-foreground" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
