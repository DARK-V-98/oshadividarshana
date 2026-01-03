
"use client";
import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-playfair text-2xl font-bold mb-4">
              Oshadi Vidarshana
            </h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Your expert resource for NVQ Level 4 study materials and professional 
              bridal services in Sri Lanka.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Courses", "Pricing", "About", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a
                  href="https://wa.me/94754420805"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background transition-colors"
                >
                  WhatsApp: +94 75 442 0805
                </a>
              </li>
              <li>
                <a
                  href="mailto:oshadi@example.com"
                  className="hover:text-background transition-colors"
                >
                  Email: oshadi@example.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+94754420805"
                  className="hover:text-background transition-colors"
                >
                  Phone: +94 75 442 0805
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-background/60 text-sm text-center md:text-left"
            >
              © {currentYear} M.K.D Oshadi Vidarshana Perera. All rights reserved.
            </motion.p>

            {/* Powered By */}
            <motion.a
              href="https://www.esystemlk.xyz"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2 text-background/60 hover:text-background transition-colors text-sm"
            >
              Powered by{" "}
              <span className="font-semibold flex items-center gap-1">
                esystemlk
                <ExternalLink className="w-3 h-3" />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};
