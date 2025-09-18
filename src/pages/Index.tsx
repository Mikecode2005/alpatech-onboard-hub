import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BrandLoader from "@/components/BrandLoader";
import { useEffect, useState } from "react";
import { 
  Award, 
  Users, 
  Shield, 
  CheckCircle, 
  Star, 
  Globe, 
  Flame,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const Index = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <BrandLoader label="alpatech" />;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Alpatech Training Centre - Premier Safety & Technical Training</title>
        <meta name="description" content="Leading provider of offshore safety training, BOSIET, Fire Watch, and technical certification programs. Over 200+ training sets completed with excellence." />
      </Helmet>

      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Fire Logo */}
              <div className="relative">
                <div className="flame scale-75"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ALPATECH</h1>
                <p className="text-xs text-muted-foreground">Training Centre</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm hover:text-primary transition-colors">About</a>
              <a href="#services" className="text-sm hover:text-primary transition-colors">Services</a>
              <a href="#achievements" className="text-sm hover:text-primary transition-colors">Achievements</a>
              <a href="#contact" className="text-sm hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/10 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  🏆 Nigeria's Premier Training Centre
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Welcome to
                  <span className="text-primary block">ALPATECH</span>
                  <span className="text-2xl lg:text-3xl font-normal text-muted-foreground">Training Centre</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Empowering professionals with world-class safety and technical training. 
                  Your gateway to offshore excellence and industry certification.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/trainee-login">
                    Start Training Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link to="/staff-login">Staff Portal Access</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              {/* Placeholder for main hero image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="flame mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Hero Training Image</p>
                  <p className="text-xs text-muted-foreground">Professional training facility photo</p>
                </div>
              </div>
              
              {/* Floating stats cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">98%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">15+</p>
                    <p className="text-xs text-muted-foreground">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Training Excellence</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Proven track record of delivering world-class training programs that meet international standards
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary">200+</div>
              <p className="text-sm text-muted-foreground">Training Sets Completed</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary">5,000+</div>
              <p className="text-sm text-muted-foreground">Professionals Trained</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary">98%</div>
              <p className="text-sm text-muted-foreground">Certification Success Rate</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary">15+</div>
              <p className="text-sm text-muted-foreground">Years of Excellence</p>
            </div>
          </div>

          {/* Image Placeholders */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Users className="h-12 w-12 mx-auto text-primary/60" />
                  <p className="text-sm font-medium text-muted-foreground">Training Facility Image</p>
                  <p className="text-xs text-muted-foreground">Professional training environment</p>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-2">State-of-the-Art Facilities</h3>
                <p className="text-muted-foreground">
                  Modern training facilities equipped with the latest safety equipment and simulation technology 
                  to provide hands-on, practical learning experiences.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-[16/10] bg-gradient-to-br from-accent/10 to-primary/20 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Shield className="h-12 w-12 mx-auto text-primary/60" />
                  <p className="text-sm font-medium text-muted-foreground">Safety Training Image</p>
                  <p className="text-xs text-muted-foreground">Professional safety instruction</p>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold mb-2">Expert Safety Training</h3>
                <p className="text-muted-foreground">
                  Internationally certified instructors delivering comprehensive safety training programs 
                  that exceed industry standards and regulatory requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-accent/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Training Programs</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive safety and technical training programs designed for offshore and industrial professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="bg-blue-100 p-3 rounded-lg w-fit">
                  <Flame className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">BOSIET Training</h3>
                <p className="text-muted-foreground">
                  Basic Offshore Safety Induction and Emergency Training for offshore personnel
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Helicopter safety procedures</li>
                  <li>• Sea survival techniques</li>
                  <li>• Emergency response protocols</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="bg-red-100 p-3 rounded-lg w-fit">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Fire Watch Training</h3>
                <p className="text-muted-foreground">
                  Specialized fire prevention and emergency response training
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Fire prevention strategies</li>
                  <li>• Emergency evacuation procedures</li>
                  <li>• Fire suppression techniques</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="bg-green-100 p-3 rounded-lg w-fit">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">CSE&R Training</h3>
                <p className="text-muted-foreground">
                  Confined Space Entry and Rescue certification program
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Confined space hazard identification</li>
                  <li>• Entry procedures and protocols</li>
                  <li>• Emergency rescue operations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Why Choose Alpatech?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With over 15 years of excellence in safety training, Alpatech Training Centre has established 
                itself as Nigeria's premier destination for offshore and industrial safety education.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">International Certification</h3>
                    <p className="text-sm text-muted-foreground">
                      Globally recognized certifications that meet international safety standards
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Expert Instructors</h3>
                    <p className="text-sm text-muted-foreground">
                      Highly qualified and experienced safety professionals
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Comprehensive Safety Focus</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete safety training ecosystem from basic to advanced levels
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Company Image Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Globe className="h-16 w-16 mx-auto text-primary/60" />
                  <p className="text-lg font-medium text-muted-foreground">Company Overview Image</p>
                  <p className="text-sm text-muted-foreground">Professional facility showcase</p>
                </div>
              </div>
              
              {/* Testimonial Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic mb-3">
                    "Alpatech provided exceptional training that exceeded our expectations. 
                    The instructors were knowledgeable and the facilities were top-notch."
                  </p>
                  <p className="text-xs font-medium">- Industry Professional</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Training Excellence Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Training Excellence by Numbers</h2>
            <p className="text-xl text-muted-foreground">
              Our commitment to excellence is reflected in our outstanding training outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <p className="text-sm text-muted-foreground">Training Sets Completed</p>
                <p className="text-xs text-muted-foreground mt-1">With outstanding results</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                <p className="text-sm text-muted-foreground">Professionals Certified</p>
                <p className="text-xs text-muted-foreground mt-1">Across various industries</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-orange-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Safety Compliance</p>
                <p className="text-xs text-muted-foreground mt-1">Zero incident record</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Partner Companies</p>
                <p className="text-xs text-muted-foreground mt-1">Trusted by industry leaders</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
                <p className="text-lg text-muted-foreground">
                  Ready to advance your career with professional safety training? 
                  Contact us to learn more about our programs and enrollment process.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground">+234 (0) 123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">info@alpatech.com.ng</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="flex-1">
                  <Link to="/trainee-login">Begin Training</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link to="/staff-login">Staff Access</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Contact/Office Image Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <MapPin className="h-16 w-16 mx-auto text-primary/60" />
                  <p className="text-lg font-medium text-muted-foreground">Office/Contact Image</p>
                  <p className="text-sm text-muted-foreground">Professional office environment</p>
                </div>
              </div>

              {/* Quick Access Card */}
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="text-xl font-bold">Ready to Start?</h3>
                  <p className="text-primary-foreground/90">
                    Join thousands of professionals who have advanced their careers with Alpatech training
                  </p>
                  <Button asChild variant="secondary" size="lg" className="w-full">
                    <Link to="/trainee-login">Access Training Portal</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flame scale-75"></div>
                <div>
                  <h3 className="text-xl font-bold">ALPATECH</h3>
                  <p className="text-xs text-muted">Training Centre</p>
                </div>
              </div>
              <p className="text-sm text-muted">
                Leading provider of offshore safety training and technical certification programs in Nigeria.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Training Programs</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li>BOSIET Training</li>
                <li>Fire Watch Certification</li>
                <li>CSE&R Programs</li>
                <li>Safety Compliance Training</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Contact Information</h4>
              <div className="space-y-2 text-sm text-muted">
                <p>📞 +234 (0) 123 456 7890</p>
                <p>✉️ info@alpatech.com.ng</p>
                <p>📍 Lagos, Nigeria</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted/20 mt-8 pt-8 text-center">
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} Alpatech Training Centre. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;