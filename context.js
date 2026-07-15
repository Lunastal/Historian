// Checkout the Guidebook examples to get an idea of other ways you can use scripting
// https://help.aidungeon.com/scripting

const modifier = (text) => {
  // Single module, always overwrite
  let ret = Historian.getContextHookText(text);
  text = ret.text;
  
  return { text }
}

// Don't modify this part
modifier(text)
