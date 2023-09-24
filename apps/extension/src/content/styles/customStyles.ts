var css = (strings: any, ...args : any) => strings.reduce((acc: any, string: any, index:any) => acc + string + (index < args.length ? args[index] : ""), "");
export const customStyles = css`
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

.radix-themes {
    --default-font-family: "Recursive", system-ui, sans-serif !important;
  }
  
  .rt-DialogOverlay {
    z-index: 12000;
    padding-bottom: 0 !important;
  }
  
  .rt-SelectContent {
    z-index: 12000 !important;
  }
  
  .rt-PopoverContent {
    z-index: 12000 !important;
  }
  
  .display-on-hover {
    text-decoration: none !important;
    border-bottom: 1px solid var(--gray-4) !important;
  }
  
  .display-on-hover:hover {
    text-decoration: none !important;
    border-bottom: 1px solid var(--gray-12)!important;
  }
  
  .display-on-hover > svg{
    display: none !important;
  }
  
  .display-on-hover:hover > svg{
    display: initial !important;
  } 
  
  .input-edit {
    border-bottom: 1px solid var(--gray-6) !important;
  }
  
  .input-edit > input {
    line-height: var(--line-height-4) !important;
    letter-spacing: var(--letter-spacing-4) !important;
    font-size: var(--font-size-4) !important;
    outline: none !important;
    border: none !important;
    width: 100% !important;
    padding: 0 !important;
    font-family: var(--default-font-family) !important;
  }
  
  .input-edit:focus-within {
    border-bottom: 1px solid var(--gray-12) !important;
  }
  
  .rt-TabsTrigger[data-state='active']::before {
    background-color: var(--gray-9) !important;
  }

  .rt-HoverCardContent {
    z-index: 12000 !important;
  }

  .rt-r-w-100% {
    width: 100% !important;
  }
`