/* Respaldo — config.js ya define SITE.supabase; esto refuerza si carga después */
window.SUPABASE_CONFIG = Object.assign({}, window.SUPABASE_CONFIG || {}, {
  url: "https://paljzienuwokoifowjxf.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbGp6aWVudXdva29pZm93anhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzczNjIsImV4cCI6MjA5Nzc1MzM2Mn0.Udpd88jKmT8MIDCbO2VMws6F4RJNJEpm119c5zorvp4",
  enabled: true,
  cloudOnly: true
});
