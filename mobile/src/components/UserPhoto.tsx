import { Image, IImageProps, Skeleton } from "native-base";
import { useEffect, useState } from "react";
import { ImageURISource } from "react-native";
import isEmpty from "lodash/isEmpty";

import userPhotoDefault from "@assets/userPhotoDefault.png";

type UserPhotoProps = IImageProps & {
  size: number;
  source: ImageURISource;
};

const UserPhoto = ({ size, source, ...props }: UserPhotoProps) => {
  const [isEmptySource, setIsEmptySource] = useState(false);

  useEffect(() => {
    setIsEmptySource(isEmpty(source));
  }, [source]);

  return !isEmptySource ? (
    <Image
      h={size}
      w={size}
      borderWidth={2}
      borderColor="gray.400"
      rounded="full"
      alt="User photo"
      source={
        source.uri
          ? {
              uri: source.uri,
            }
          : userPhotoDefault
      }
      {...props}
    />
  ) : (
    <Skeleton
      h={size}
      w={size}
      rounded="full"
      startColor="gray.400"
      endColor="gray.500"
      {...props}
    />
  );
};

export { UserPhoto };
