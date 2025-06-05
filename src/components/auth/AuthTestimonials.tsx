'use client'

import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'

const testimonials = [
  {
    quote: "This platform has completely transformed how we manage our business operations. The intuitive interface and powerful features have saved us countless hours.",
    name: "Sarah Chen",
    designation: "CEO, TechStart Inc.",
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&h=400&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    quote: "The authentication system is rock-solid and the user experience is seamless. Our team productivity has increased by 40% since we started using this platform.",
    name: "Michael Rodriguez",
    designation: "CTO, InnovateLab",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    quote: "Security and ease of use don't often go hand in hand, but this platform delivers both. It's exactly what we needed for our growing startup.",
    name: "Emily Johnson",
    designation: "Product Manager, GrowthCo",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    quote: "The integration process was smooth and the support team was incredibly helpful. This solution has exceeded all our expectations.",
    name: "David Kim",
    designation: "Lead Developer, CodeCraft",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    quote: "From day one, this platform has been a game-changer. The features are comprehensive yet easy to use, perfect for our enterprise needs.",
    name: "Lisa Thompson",
    designation: "Operations Director, Enterprise Solutions",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&auto=format&fit=crop&ixlib=rb-4.0.3"
  }
]

export function AuthTestimonials() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="w-full h-full flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by thousands of users
          </h2>
          <p className="text-lg text-gray-300">
            See what our customers have to say about their experience
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </div>
  )
}
