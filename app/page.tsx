"use client"

import Hero from "./components/Hero";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div>
      <Hero />
    </motion.div>
  );
}