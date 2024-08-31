class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error("Uncaught error:", error, errorInfo);
      // You can also log the error to an error reporting service here
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div className="error-boundary">
            <h1>Oops! Something went wrong.</h1>
            <p>We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
          </div>
        );
      }
  
      return this.props.children; 
    }
  }
  
  export default ErrorBoundary;