import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does Lyrica.ai's text rewriting work?",
    answer: "Lyrica.ai uses advanced AI models to analyze your text and rewrite it according to your selected writing style. Our AI understands context, tone, and meaning to produce high-quality, natural-sounding content while preserving your original message."
  },
  {
    question: "What writing styles are available?",
    answer: "We offer 7 different writing modes: Standard (balanced and clear), Formal (professional tone), Academic (scholarly style), Expanded (detailed content), Summary (concise version), Narrative (storytelling format), and Creative (imaginative expression)."
  },
  {
    question: "Can I download the rewritten content?",
    answer: "Yes! You can download your rewritten text in both PDF and Word (DOCX) formats. The documents are professionally formatted and ready for immediate use in presentations, reports, or publications."
  },
  {
    question: "Is there a character limit for text rewriting?",
    answer: "Currently, there are no strict character limits for individual rewrites. However, for optimal performance and processing speed, we recommend keeping individual texts under 10,000 characters. Longer texts can be processed in segments."
  },
  {
    question: "How accurate is the AI rewriting?",
    answer: "Our AI maintains high accuracy in preserving the original meaning while adapting the style. The system uses context-aware processing to ensure factual information remains correct, though we always recommend reviewing the output for critical applications."
  },
  {
    question: "Is my content secure and private?",
    answer: "Absolutely. We prioritize your privacy and data security. Your text inputs are processed securely and are not stored on our servers after processing. We don't use your content to train our models or share it with third parties."
  }
]

export default function FAQ() {
  return (
    <div id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
} 