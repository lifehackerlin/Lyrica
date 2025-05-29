'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="gradient-bg text-foreground">
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-background lg:block"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <div className="hidden sm:mb-10 sm:flex">
                  <div className="relative rounded-full px-3 py-1 text-sm/6 text-muted-foreground ring-1 ring-border hover:ring-primary">
                    Powered by Advanced AI Technology{' '}
                    <Link href="/rewriter" className="font-semibold whitespace-nowrap text-primary">
                      <span aria-hidden="true" className="absolute inset-0" />
                      Try Now <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
                <h1 className="text-5xl font-semibold tracking-tight text-pretty sm:text-7xl gradient-text">
                  AI-Powered Text Rewriting
                </h1>
                <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                  Transform your writing with Lyrica.ai's powerful AI rewriting tool. Choose from multiple writing styles, 
                  get real-time results, and download professional documents.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Button asChild size="lg" className="btn-primary font-semibold">
                    <Link href="/rewriter">
                      Start Rewriting
                    </Link>
                  </Button>
                  <Link href="#features" className="text-sm/6 font-semibold text-muted-foreground hover:text-foreground">
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-secondary lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            alt="AI Writing Technology"
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80"
            className="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
          />
        </div>
      </div>
    </div>
  )
}
