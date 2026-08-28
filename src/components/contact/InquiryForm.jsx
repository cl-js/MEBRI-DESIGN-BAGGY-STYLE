import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function InquiryForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    occasion: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Inquiry sent successfully." });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-16 text-center"
      >
        <h3 className="font-body text-2xl md:text-3xl font-light text-foreground mb-4">
          Thank you for reaching out.
        </h3>
        <p className="font-body text-base text-muted-foreground">
          I'll review your inquiry and respond within 48 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Name *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your full name"
            className="bg-transparent border-0 border-b border-border rounded-none font-body text-base h-12 focus:ring-0 focus:border-b-2 focus:border-cobalt"
          />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Email *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@email.com"
            className="bg-transparent border-0 border-b border-border rounded-none font-body text-base h-12 focus:ring-0 focus:border-b-2 focus:border-cobalt"
          />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Occasion
          </label>
          <Input
            value={formData.occasion}
            onChange={(e) => handleChange("occasion", e.target.value)}
            placeholder="e.g. Wedding, ceremony, everyday wear"
            className="bg-transparent border-0 border-b border-border rounded-none font-body text-base h-12 focus:ring-0 focus:border-b-2 focus:border-cobalt"
          />
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Garment Type
          </label>
          <Select value={formData.projectType} onValueChange={(v) => handleChange("projectType", v)}>
            <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none font-body text-base h-12 focus:ring-0 focus:border-b-2 focus:border-cobalt">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bespoke" className="focus:bg-charcoal focus:text-gallery">Bespoke Garment</SelectItem>
              <SelectItem value="upper" className="focus:bg-charcoal focus:text-gallery">Upper-body pieces</SelectItem>
              <SelectItem value="lower" className="focus:bg-charcoal focus:text-gallery">Lower-body pieces</SelectItem>
              <SelectItem value="outerwear" className="focus:bg-charcoal focus:text-gallery">Outerwear / Sets</SelectItem>
              <SelectItem value="editorial" className="focus:bg-charcoal focus:text-gallery">Editorial / Stockist</SelectItem>
              <SelectItem value="other" className="focus:bg-charcoal focus:text-gallery">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Budget Range
          </label>
          <Select value={formData.budget} onValueChange={(v) => handleChange("budget", v)}>
            <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none font-body text-base h-12 focus:ring-0 focus:border-b-2 focus:border-cobalt">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500-1500" className="focus:bg-charcoal focus:text-gallery">$500  -  $1,500</SelectItem>
              <SelectItem value="1500-5000" className="focus:bg-charcoal focus:text-gallery">$1,500  -  $5,000</SelectItem>
              <SelectItem value="5000-15000" className="focus:bg-charcoal focus:text-gallery">$5,000  -  $15,000</SelectItem>
              <SelectItem value="15000+" className="focus:bg-charcoal focus:text-gallery">$15,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Timeline
          </label>
          <Select value={formData.timeline} onValueChange={(v) => handleChange("timeline", v)}>
            <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none font-body text-base h-12 focus:ring-0 focus:border-b-2 focus:border-cobalt">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2months" className="focus:bg-charcoal focus:text-gallery">1  -  2 months</SelectItem>
              <SelectItem value="3-6months" className="focus:bg-charcoal focus:text-gallery">3  -  6 months</SelectItem>
              <SelectItem value="6months+" className="focus:bg-charcoal focus:text-gallery">6+ months</SelectItem>
              <SelectItem value="flexible" className="focus:bg-charcoal focus:text-gallery">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="font-mono text-xs tracking-widest uppercase text-muted-foreground block mb-2">
          Project Details *
        </label>
        <Textarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Tell me about the piece you envision, the occasion, and any fabrics or traditions you'd like honoured..."
          className="bg-transparent border-0 border-b border-border rounded-none font-body text-base min-h-[160px] focus:ring-0 focus:border-b-2 focus:border-cobalt"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center px-10 py-4 bg-charcoal text-gallery font-mono text-xs tracking-widest uppercase hover:bg-cobalt transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-4"
      >
        Send Commission
      </button>
    </form>
  );
}