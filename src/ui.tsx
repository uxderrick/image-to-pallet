import "!prismjs/themes/prism-tomorrow.css";
import {
  Button,
  Container,
  Text,
  VerticalSpace,
  render,
  Tabs,
  TabsOption,
  IconArrowLeftRight32,
} from "@create-figma-plugin/ui";
import { h, RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import useColorThief from "use-color-thief";

import styles from "./styles.css";
import React from "preact/compat";

function Plugin() {
  const [activeTab, setActiveTab] = useState<string>("image");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { color, palette } = useColorThief(imageSrc as string, {
    format: "hex",
    colorCount: 8,
    quality: 10,
  });
  const containerElementRef: RefObject<HTMLDivElement> = useRef(null);
  const [showPalette, setShowPalette] = useState<boolean>(false);

  const handleImageUpload = useCallback((event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowPalette(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleBackClick = useCallback(() => {
    setShowPalette(false);
    setImageSrc(null);
  }, []);

  const handleApplyColorsButtonClick = useCallback(() => {
    if (palette) {
      console.log("Sending APPLY_COLORS:", palette);
      parent.postMessage(
        { pluginMessage: { type: "APPLY_COLORS", palette: palette } },
        "*"
      );
    }
  }, [palette]);

  const handleAddToStylesClick = useCallback(() => {
    if (palette) {
      console.log("Sending ADD_TO_STYLES:", palette);
      parent.postMessage(
        { pluginMessage: { type: "ADD_TO_STYLES", palette: palette } },
        "*"
      );
    }
  }, [palette]);

  useEffect(() => {
    const resizeWindow = () => {
      if (containerElementRef.current) {
        const height = containerElementRef.current.offsetHeight;
        parent.postMessage({ pluginMessage: { type: "resize", height } }, "*");
      }
    };

    resizeWindow();
    window.addEventListener("resize", resizeWindow);

    return () => window.removeEventListener("resize", resizeWindow);
  }, [imageSrc, palette]);

  const renderImageTab = () => (
    <React.Fragment>
      {!showPalette ? (
        <div
          className={styles.uploadContainer}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            height: "120px",
            marginTop: "10px",
            cursor: "pointer",
            border: "2px dashed var(--figma-color-border)",
            borderRadius: "8px",
            padding: "20px",
          }}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
            id="fileInput"
            style={{ display: "none" }}
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Text
            style={{
              color: "var(--figma-color-text)",
              fontSize: "12px",
              marginTop: "4px",
              marginBottom: "2px",
            }}
          >
            Click to upload an image
          </Text>
          <Text
            style={{
              color: "gray",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            Upload an image to generate a color palette
          </Text>
        </div>
      ) : (
        <React.Fragment>
          <VerticalSpace space="extraSmall" />
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              gap: "1fr",
            }}
          >
            {palette && (
              <div style={{ width: "fit-content" }}>
                <VerticalSpace space="extraSmall" />
                <Text>
                  <h3
                    style={{
                      margin: "0",
                      // fontWeight: "bold",
                      color: "gray",
                      marginBottom: "4px",
                    }}
                  >
                    Colors found:
                  </h3>
                </Text>
                <VerticalSpace space="small" />
                <div
                  className={styles.palette}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(9, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div
                    className={styles.imagePreview}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "var(--figma-color-background)",
                      border: "1px solid var(--figma-color-border)",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={imageSrc as string}
                      alt="Uploaded image"
                      style={{
                        width: "36px",
                        height: "36px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  {palette.map((color, index) => (
                    <div
                      key={index}
                      className={styles.color}
                      style={{
                        backgroundColor: color as string,
                        aspectRatio: "1 / 1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <VerticalSpace space="extraSmall" />
          <div
            className="divider"
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "var(--figma-color-border)",
              margin: "0",
              opacity: "0.2",
            }}
          ></div>
          <VerticalSpace space="small" />
          <div
            className="div"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <Button onClick={handleApplyColorsButtonClick} disabled={!palette}>
              Generate Palette
            </Button>
            <Button
              onClick={handleAddToStylesClick}
              disabled={!palette}
              secondary
              style={{
                border: "1px solid var(--figma-color-border)",
              }}
            >
              Add to Styles
            </Button>
            <Button
              onClick={handleBackClick}
              style={{
                backgroundColor: "transparent",
                border: "1px solid var(--figma-color-border)",
                color: "var(--figma-color-text)",
              }}
            >
              Upload another image
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );

  const renderWebsiteTab = () => (
    <div
      style={{
        marginTop: "10px",
        height: "120px",
      }}
    >
      <Text style={{ textAlign: "center", color: "gray" }}>
        Website tab content coming soon...
      </Text>
    </div>
  );

  const renderRandomTab = () => (
    <div
      style={{
        marginTop: "10px",
        height: "120px",
      }}
    >
      <Text style={{ textAlign: "center", color: "gray" }}>
        Random tab content coming soon...
      </Text>
    </div>
  );

  const tabOptions: Array<TabsOption> = [
    {
      children: renderImageTab(),
      value: "image",
    },
    {
      children: renderWebsiteTab(),
      value: "website",
    },
    {
      children: renderRandomTab(),
      value: "random",
    },
  ];

  function handleTabChange(newValue: string) {
    console.log(newValue);
    setActiveTab(newValue);
  }

  return (
    <Container
      ref={containerElementRef}
      space="extraSmall"
      style={{
        paddingBottom: "8px",
      }}
    >
      <Tabs
        options={tabOptions}
        value={activeTab}
        onValueChange={handleTabChange}
      />
      {activeTab === "image"}
      {activeTab === "website"}
      {activeTab === "random"}
      <Button
        onClick={() => {
          window.open("https://buymeacoffee.com/uxderrick", "_blank");
        }}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "gray",
          padding: "0",
          margin: "0",
          textDecoration: "underline",
        }}
      >
        Buy me a coffee
      </Button>
    </Container>
  );
}

export default render(Plugin);
