import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, MapPin, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+94 75 442 0805",
    href: "https://wa.me/94754420805",
    color: "from-green-500 to-green-600",
    description: "Fastest response",
  },
  {
    icon: Mail,
    label: "Email",
    value: "oshadi@example.com",
    href: "mailto:oshadi@example.com",
    color: "from-primary to-rose-dark",
    description: "For detailed inquiries",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+94 75 442 0805",
    href: "tel:+94754420805",
    color: "from-blue-500 to-blue-600",
    description: "Direct call",
  },
];

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to start your journey? Reach out to us through any of these channels
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.label}
              href={method.href}
              target={method.label === "WhatsApp" ? "_blank" : undefined}
              rel={method.label === "WhatsApp" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-card border border-border rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-1">
                {method.label}
              </h3>
              <p className="text-primary font-medium mb-1">{method.value}</p>
              <p className="text-muted-foreground text-sm">{method.description}</p>
            </motion.a>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-rose-medium/20 to-gold/20 rounded-3xl blur-2xl" />
          <div className="relative bg-card border border-primary/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
              Start Your Journey Today
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Send us a message on WhatsApp to order your study materials or book a bridal consultation
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl px-8 py-6 text-lg"
            >
              <a href="https://wa.me/94754420805" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Location Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-12 text-muted-foreground"
        >
          <MapPin className="w-4 h-4" />
          <span>Sri Lanka</span>
        </motion.div>
      </div>
    </section>
  );
};
