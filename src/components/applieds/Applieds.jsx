import Appliedc from "../appliedc/Appliedc";
import "./applieds.scss";

const Applieds = ({ applieds, setApplieds }) => {
  //Doi sua thanh status nua la  bo cmt la Ok
  // const filteredPosts = posts.filter(post => post.image != null);
  // console.log(filteredPosts);

  return (
    <div className="applied">
      {applieds.map((applied) => (
        <Appliedc
          setApplieds={setApplieds}
          applied={applied}
          key={applied.id}
          applieds={applieds}
        />
      ))}
    </div>
  );
};

export default Applieds;
