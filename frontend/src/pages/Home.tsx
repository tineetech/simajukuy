import Header from "../components/Navigations/Header";
import Hero from "../components/HomeSections/Hero";
import About from "../components/HomeSections/About";
import Features from "../components/HomeSections/Features";
import Contact from "../components/HomeSections/Contact";
import Footer from "../components/Navigations/Footer";

export default function HeroSection() {

	return (
		<div className=" bg-background text-text">
			<Header />
			<Hero />
			<div className="container mx-auto">
				<About />
				<Features />
				<Contact />
			</div>
			<Footer />
		</div>
	);
}
