import { Dimensions } from 'react-native';

export class DimensionHelper {
  constructor(props) {
    if (props) {
      let { header } = props;
      if (header) {
        this.header = header;
      }
    }
  };

  getDimensions() {
    let windowHeight = Dimensions.get('window').height;

    if (this.header && this.header.HEIGHT) {
      console.log('header is present.')
      windowHeight = windowHeight - this.header.HEIGHT;
    }

    const topHeight = windowHeight / 2;

    const dims = {
      windowHeight: windowHeight,
      topHeight: topHeight,
      btmHeight: windowHeight - topHeight
    }

    return () => dims
  }

}