import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie("Todo-photos");
db.version(1).stores({
  photos: "id",
});
// if the attribute should be indexed, add it here. there is no need to write all the attributes

async function addPhoto(id, imgSrc) {
  console.log("add photo", imgSrc.length, id);
  try {
    const i = await db.photos.add({
      id: id,
      imgSrc: imgSrc,
    });
    console.log(`Photo ${imgSrc.length} bytes successfully added, id is ${i}`);
  } catch (error) {
    console.log(`Failed to add photo: ${error}`);
  }
  return (
    <>
      <p>
        {imgSrc.length} &nbsp; | &nbsp; {id}
      </p>
    </>
  );
}

function GetPhotoSrc(id) {
  console.log("getPhotoSrc", id);
  const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());
  console.table(img);
  if (Array.isArray(img)) {
    return img[0].imgSrc;
  }
  //   if that's is an array, the system find at least one line of data
}

export { addPhoto, GetPhotoSrc };
