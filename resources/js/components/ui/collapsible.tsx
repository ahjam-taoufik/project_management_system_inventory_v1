import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  className = "",
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & { className?: string }) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={`overflow-hidden ${className}`}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

// Je retire le bloc d'export default CollapsibleWithAnimation car le style global doit être appliqué dans le layout global ou _app.tsx, pas ici.
