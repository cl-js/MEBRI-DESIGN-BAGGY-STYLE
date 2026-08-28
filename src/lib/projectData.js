const asset = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

const source = [
  ["Volume Tee 01", "Heavyweight cotton / dropped shoulder", "Upper", "$110", "Oversized / relaxed", "460gsm brushed cotton", "photo-1529139574466-a303027c1d8b", "More room to move."],
  ["Wide-Leg Study", "Pleated twill / extended line", "Lower", "$185", "Wide leg / high rise", "Structured cotton twill", "photo-1496747611176-843222e1e57c", "The silhouette starts below the waist."],
  ["Box Shirt 02", "Poplin / asymmetric pocket", "Upper", "$160", "Boxy / dropped shoulder", "Washed cotton poplin", "photo-1523381294911-8d3cead13475", "A shirt, redrawn."],
  ["Utility Cargo 01", "Dry canvas / articulated volume", "Lower", "$210", "Relaxed / adjustable", "Dry cotton canvas", "photo-1558618666-fcd25c85cd64", "Function, with a longer shadow."],
  ["Cropped Shell 01", "Recycled nylon / clean volume", "Outerwear", "$290", "Cropped / relaxed", "Recycled nylon shell", "photo-1525507119028-ed4c629a60a3", "A shell for changing weather."],
  ["Soft Set 01", "Loopback fleece / tonal ease", "Sets", "$240", "Oversized / easy", "Midweight loopback fleece", "photo-1515886657613-9f3515b0c78f", "Together, but not uniform."],
  ["Heavy Hood 01", "Brushed fleece / enveloping hood", "Essentials", "$175", "Oversized / cocoon", "Brushed organic cotton fleece", "photo-1483985988355-763728e1935b", "The everyday, enlarged."],
  ["Denim Volume 01", "Rigid denim / low break", "Lower", "$220", "Baggy / mid rise", "14oz rigid denim", "photo-1496747611176-843222e1e57c", "Let the leg speak."],
];

const projects = source.map(([title, subtitle, category, price, fit, material, imageId, tagline], index) => {
  const image = asset(imageId);
  return {
    id: String(index + 1).padStart(2, "0"), slug: title.toLowerCase().replaceAll(" ", "-"), title, subtitle, category, price, fit, material, year: "2026", role: "Mebri Studio", tagline,
    objective: `A contemporary ${category.toLowerCase()} piece built around volume, balance, and everyday movement.`,
    description: `${title} makes space the defining detail. Generous proportions, considered construction, and a quiet finish create a silhouette that moves with the wearer.`,
    problem: "The everyday garment is often reduced to a narrow, standard fit.", solution: "A disciplined oversized block with measured proportions and room where the body needs it.", process: "Patterned in Addis Ababa and refined through movement tests across three body types.",
    outcomes: ["A core Mebri uniform", "Designed for layering", "Made in small studio runs"], deliverables: [material, fit, "Small Batch", "Mebri Studio"], image, heroImage: image, processImage: image, images: [image],
  };
});

export const projectCount = projects.length;
export const normalizedProjects = projects;
export { normalizedProjects as projects };
