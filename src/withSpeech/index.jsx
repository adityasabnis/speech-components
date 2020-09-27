import React from "react";
import _ from "lodash";

const withSpeech = (Component) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        voice: null,
      };

      this.componentRef = React.createRef();

      this.utterance = new SpeechSynthesisUtterance();
      speechSynthesis.addEventListener("voiceschanged", this.setSelectedVoice);
    }

    setSelectedVoice = (event) => {
      event.preventDefault();

      const selectedVoice = _.find(
        speechSynthesis.getVoices(),
        (voice) => voice.voiceURI === this.props.voiceUri
      );

      if (selectedVoice) {
        this.setState({
          voice: selectedVoice,
        });
      }
    };

    handleOnClick = () => {
      const wrappedComponent = _.get(this.componentRef, "current");

      this.utterance.text = _.get(
        wrappedComponent.props,
        `${_.get(this.props, "speechTextPropName")}`
      );

      this.utterance.voice = this.state.voice;
      speechSynthesis.speak(this.utterance);
    };

    handleOnMouseLeave = () => {
      speechSynthesis.cancel();
    };

    renderWrappedComponent = () => {
      return (
        <Component
          {..._.omit(this.props, ["speechTextPropName", "voiceUri"])}
          ref={this.componentRef}
        />
      );
    };

    render() {
      return this.state.voice ? (
        <span
          className="gt__component-wrapper"
          onClick={this.handleOnClick}
          onMouseLeave={this.handleOnMouseLeave}
        >
          {this.renderWrappedComponent()}
        </span>
      ) : (
        this.renderWrappedComponent()
      );
    }
  };
};

export default withSpeech;
