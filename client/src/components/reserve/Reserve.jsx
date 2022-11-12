import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./reserve.css";

const Reserve = ({ setOpen, hotelId }) => {
    const [selectedRooms, setSelectedRooms] = useState([]);
    const { data, loading, error } = useFetch(
        `http://localhost:8800/api/hotels/room/${hotelId}`
    );
    const { dates } = useContext(SearchContext);
    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start.getTime());

        let list = [];
        while (date <= end) {
            list.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1);
        }

        return list;
    };
    const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);
    console.log(allDates)

    const isAvalable = (roomNumber) => {
        const isFound = roomNumber.unvailableDates.some((date) =>
            allDates.includes(new Date(date).getTime())
        );
        return !isFound;
    };

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(
            checked
                ? [...selectedRooms, value]
                : selectedRooms.filter((item) => item !== value)
        );
    };

    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            await Promise.all(
                selectedRooms.map((roomId) => {
                    const res = axios.put(
                        `http://localhost:8800/api/rooms/availability/${roomId}`,
                        { dates: allDates }
                    );
                    return res.data;
                })
            );
            setOpen(false)
            navigate("/")
        } catch (err) {}
    };

    return (
        <div className="reserve">
            <div className="rContainer">
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="rClose"
                    onClick={() => setOpen(false)}
                />
                <span>Select your room:</span>
                {data.map((item) => (
                    <div className="rItem">
                        <div className="rItemInfo">
                            <div className="rTitle">{item.title}</div>
                            <div className="rDesc">{item.desc}</div>
                            <div className="rMax">
                                Max people: <b>{item.maxPeople}</b>
                            </div>
                            <div className="rPrice">
                                Price: <b>{item.price}</b>
                            </div>
                        </div>
                        <div className="rSelectRooms">
                            {item.roomNumbers.map((roomNumber) => (
                                <div className="room">
                                    <label>{roomNumber.number}</label>
                                    <input
                                        type="checkbox"
                                        value={roomNumber._id}
                                        onChange={handleSelect}
                                        disabled={!isAvalable(roomNumber)}
                                    />{" "}
                                    {/* value is _id of each rooom */}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button onClick={handleClick} className="rButton">
                    Reserve now
                </button>
            </div>
        </div>
    );
};

export default Reserve;
