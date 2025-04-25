import Hero from "../components/HomeSections/Hero";
import About from "../components/HomeSections/About";
import Features from "../components/HomeSections/Features";
import Contact from "../components/HomeSections/Contact";

export default function HomePage() {

	return (
		<div className=" bg-background text-text dark:bg-backgroundDark dark:text-textDark">
			<Hero />
			<div className="container mx-auto">
				<About />
				<Features />
				<Contact />
			</div>
		</div>
	);
}
