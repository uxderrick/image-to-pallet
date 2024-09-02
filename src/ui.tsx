import "!prismjs/themes/prism-tomorrow.css";
import {
  Button,
  Container,
  Columns,
  Text,
  VerticalSpace,
  render,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h, RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import useColorThief from "use-color-thief";

import styles from "./styles.css";
import { ApplyColorsHandler } from "./types";
import React from "preact/compat";

function Plugin() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { color, palette } = useColorThief(imageSrc as string, {
    format: "hex",
    colorCount: 6,
    quality: 10,
  });
  const containerElementRef: RefObject<HTMLDivElement> = useRef(null);

  const handleImageUpload = useCallback((event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
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

  return (
    <Container space="medium" ref={containerElementRef}>
      <VerticalSpace space="large" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/10054/10054290.png"
          alt="logo Logo"
          style={{ width: "32px", height: "32px" }}
        />
      </div>
      <VerticalSpace space="large" />
      <Text>
        <h2
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Image-to-Palette
        </h2>
      </Text>
      <VerticalSpace space="small" />
      <Text style={{ textAlign: "center", color: "gray" }}>
        Upload an image to generate a color palette:
      </Text>
      <VerticalSpace space="medium" />
      <div className={styles.uploadContainer}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.fileInput}
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className={styles.fileInputLabel}
          style={{
            color: "#000",
            backgroundColor: "#fff",
          }}
        >
          Choose an image
        </label>
      </div>
      <VerticalSpace space="medium" />
      {imageSrc && (
        <React.Fragment>
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              gap: "24px",
              marginBottom: "10px",
              marginLeft: "10px",
            }}
          >
            <div className={styles.imagePreview} style={{}}>
              <img
                src={imageSrc}
                alt="Uploaded image"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            {palette && (
              <div style={{ width: "48%" }}>
                <Text>
                  <h3
                    style={{
                      margin: "0",
                      fontWeight: "bold",
                      color: "gray",
                    }}
                  >
                    Generated Palette:
                  </h3>
                </Text>
                <VerticalSpace space="small" />
                <div
                  className={styles.palette}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
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
                    >
                      <span className={styles.colorHex}>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <VerticalSpace space="large" />
          <Button
            fullWidth
            onClick={handleApplyColorsButtonClick}
            disabled={!palette}
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              width: "380px",
            }}
          >
            Generate Palette
          </Button>
          <VerticalSpace space="small" />
          <Button
            fullWidth
            onClick={handleAddToStylesClick}
            disabled={!palette}
            secondary
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              width: "380px",
            }}
          >
            Add to Styles
          </Button>
        </React.Fragment>
      )}
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
