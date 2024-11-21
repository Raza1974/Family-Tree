import FamilyTree from '@/app/components/familytree';


export default function Home() {
  return (
    <main className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center">Family Tree Application</h1>
      <FamilyTree />
    </main>
  );
}
