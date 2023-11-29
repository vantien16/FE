import Exchange from "../exchange/Exchange";
import "./exchanges.scss";

const Exchanges = ({ exchanges, setExchanges, view }) => {
  //Doi sua thanh status nua la  bo cmt la Ok
  // const filteredPosts = posts.filter(post => post.image != null);
  // console.log(filteredPosts);

  return (
    <div className="exchanges">
      {/* {filteredPosts.map(post=>( */}
      {exchanges.map((exchange) => (
        <Exchange
          setExchanges={setExchanges}
          exchange={exchange}
          key={exchange.id}
          exchanges={exchanges}
          view={view}
        />
      ))}
    </div>
  );
};

export default Exchanges;
