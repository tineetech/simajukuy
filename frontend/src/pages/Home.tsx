import Hero from "../components/HomeSections/Hero";
import About from "../components/HomeSections/About";
import Features from "../components/HomeSections/Features";
import Contact from "../components/HomeSections/Contact";

export default function HeroSection() {

	return (
		<div className=" bg-background text-text">
			<Hero />
			<div className="container mx-auto">
				<About />
				<Features />
				<Contact />
			</div>
		</div>
	);
}
