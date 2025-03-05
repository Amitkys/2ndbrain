export default function Instruction() {
  return (
    <div className="text-sm text-muted-foreground">
      <p>Instructions:</p>
      <ul className="list-disc list-inside ml-2">
        <li>Type text and URLs together, then click &quot;Add Content&quot;</li>
          <li>URLs will be automatically detected and made clickable</li>
          <li>Paste an image from clipboard (Ctrl+V)</li>
          <li>Drag and drop an image file</li>
          <li>Click on image previews to see them in full size</li>
          <li>Hover over items to see the remove button</li>
        </ul>
      <p className="mt-2">All content is logged to the console (F12 to view)</p>
    </div>
  )
}
