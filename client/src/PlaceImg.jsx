export default function PlaceImg({place, index=0, className}) {
    if (!place.photos?.length) {
        return ''
    }
    if (!className) {
        className = "object-cover"
    }
  
    return (
    
    <img className={"flex h-32 w-32 " + className} src={"http://localhost:4000/" + place.photos[index]}  alt=""/>

    )
}