import * as React from "react";
import PropTypes from "prop-types";

const HiddenAutoDownload = (props) => {
  const { downloadUrl, downloadName, onCleanup } = props;
  const elementRef = React.useRef();

  React.useEffect(() => {
    if (!downloadUrl) return;
    elementRef.current.click();
    URL.revokeObjectURL(downloadUrl);
    onCleanup();
  }, [downloadUrl, onCleanup]);

  return (
    <a style={{ display: "none" }} download={downloadName} href={downloadUrl} ref={elementRef}>
      download
    </a>
  );
};

HiddenAutoDownload.propTypes = {
  downloadUrl: PropTypes.string,
  downloadName: PropTypes.string,
  onCleanup: PropTypes.func,
};

export default HiddenAutoDownload;
