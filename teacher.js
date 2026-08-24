function teacherMessage(context){
  const c=context?.class;
  if(!c) return "Hola. Soy tu profesora de Canto Forever. Vamos a trabajar paso a paso.";
  return `Hola. Hoy estamos en la clase ${c.id}: ${c.title}. ${c.objective} Recuerda: primero entendemos, después practicamos y finalmente comprobamos lo aprendido.`;
}
