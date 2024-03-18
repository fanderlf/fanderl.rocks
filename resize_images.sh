#!/bin/bash
if [ "$#" -eq 0 ]
then
  echo "Please add the day as an argument"
  exit 1
fi

mkdir "./content/neuseeland/images/$1"
sips -Z 1000 ./original_images/*.JPG
sips -Z 1000 ./original_images/*.jpg
sips -Z 1000 ./original_images/*.png
mv -v ./original_images/* "./content/neuseeland/images/$1"