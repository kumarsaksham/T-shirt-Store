import Menu from "./Menu";

const Base = ({
    title = "My Title",
    description = "My Description",
    className = "bg-dark text-white p-4",
    children
}) => {
    return (
        <div>
            <Menu />
            <div className="container-fluid px-0">
                <div className="jumbotron bg-dark text-white text-center p-4">
                    <h2 className="display-4">{ title }</h2>
                    <p className="lead">{ description }</p>
                </div>
                <div className={className}>
                    { children }
                </div>
            </div>

            <footer className="footer bg-dark mt-auto py-3">
                <div className="container-fluid bg-success text-white text-center">
                    <h4>If you have any problem, feel free to contact us.</h4>
                    <button className="btn btn-warning btn-lg">Contact Us</button>
                </div>
                <div className="container">
                    <span className="text-muted">Copyright @The Tshirt Store</span>
                </div>
            </footer>
        </div>
    );
}
 
export default Base;