import { RingLoader } from "react-spinners";
import css from "./loading.module.css";

export default function Loader() {
  return <div className={css.backdrop}>{<RingLoader color="red" />}</div>;
}
