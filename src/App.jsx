import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { ThemeProvider } from 'next-themes';

import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Accessibility from '@/pages/Accessibility';
import Admin from '@/pages/Admin';
import Gallery from '@/pages/Gallery';
import UpdateContact from '@/pages/UpdateContact';
import { ProjectDataProvider } from '@/lib/ProjectDataContext';
import { LanguageProvider } from '@/lib/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
    <ProjectDataProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/update-contact" element={<UpdateContact />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
      </ThemeProvider>
    </ProjectDataProvider>
    </LanguageProvider>
  );
}