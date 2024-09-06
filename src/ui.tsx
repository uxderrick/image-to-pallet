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
import { ColorThiefColor } from 'use-color-thief';

import styles from "./styles.css";
import React from "preact/compat";

import { ImageTab } from './components/ImageTab'
import { WebsiteTab } from './components/WebsiteTab'
import { RandomTab } from './components/RandomTab'

function Plugin() {
  const [activeTab, setActiveTab] = useState<string>("image");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { color, palette } = useColorThief(imageSrc as string, {
    format: "hex",
    colorCount: 8,
    quality: 10,
  }) as { color: string | null, palette: ColorThiefColor[] };
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

  const tabOptions: Array<TabsOption> = [
    {
      children: (
        <ImageTab
          showPalette={showPalette}
          imageSrc={imageSrc}
          palette={palette?.filter((color): color is string => typeof color === 'string') || []}
          handleImageUpload={handleImageUpload}
          handleBackClick={handleBackClick}
          handleApplyColorsButtonClick={handleApplyColorsButtonClick}
          handleAddToStylesClick={handleAddToStylesClick}
        />
      ),
      value: 'image'
    },
    {
      children: <WebsiteTab />,
      value: 'website'
    },
    {
      children: <RandomTab />,
      value: 'random'
    }
  ]

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
      <Button
        onClick={() => {
          window.open("https://buymeacoffee.com/uxderrick", "_blank");
        }}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "gray",
          padding: "0",
          marginTop: "2px",
          marginBottom: "4px",
          textDecoration: "underline",
        }}
      >
        Buy me a coffee
      </Button>
    </Container>
  );
}

export default render(Plugin);
