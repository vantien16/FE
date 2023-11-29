import Pet from "../pet/Pet";
import "./pets.scss";

const Pets = ({ pets, setPets }) => {
  // useEffect(() => {
  //   console.log("pett petts" + pets);
  // }, []);
  return (
    <div className="posts">
      {pets.map((pet) => (
        // <Pet pet={pet} key={pet.id} />
        <Pet setPets={setPets} pet={pet} key={pet.id} pets={pets} />
      ))}
    </div>
  );
};

export default Pets;
