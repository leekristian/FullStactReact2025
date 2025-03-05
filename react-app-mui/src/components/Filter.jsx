import { useDispatch, useSelector } from "react-redux";
import { getFilterCategories } from "../services/api";
import { updateFilter, resetFilter } from "../redux/dataSlice";


const Filter = () => {    
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.data.filters);
    const categories = getFilterCategories();
    
    const handleCheckboxChange = (category, option) => {
        let updatedFilter = {};
                
        if(filters[category].includes(option)) {
            updatedFilter = {
                 ...filters, 
                 [category]: filters[category].filter((item) => item !== option)
             };
         } else {
            updatedFilter = {
                 ...filters, 
                 [category]: [...(filters[category]),option]
             };
         }

        dispatch(updateFilter(updatedFilter));
    }

    const getActiveFilters = () => {
        const activeFilters = [];        
        Object.keys(filters).forEach((category) =>             
            filters[category].forEach((option) =>                             
                activeFilters.push(`${category}-${option}`)              
         ))        
         
        console.log(activeFilters);
        return activeFilters;
    };

    const handleRemoveFilter = (filter) => {
        const category = filter.substring(0, filter.indexOf('-'));
        const option = filter.substring(filter.indexOf('-')+1);
        let updatedFilter = {};
        
        updatedFilter = {
            ...filters, 
                 [category]: filters[category].filter((item) => item !== option)
        }

        dispatch(updateFilter(updatedFilter));
    };

    const handleClearFilters = () => {
        dispatch(resetFilter());
        getActiveFilters();
    };

    return (
        <div>
            <h3>Filters</h3>
            <div className="filter-container">
                {Object.keys(categories).map((category) => (
                    <div key = {category}>
                        <h3>{category}</h3>
                        {categories[category].map((option) => 
                            <div key={option}>    
                                <input 
                                    type="checkbox"
                                    checked={filters[category].includes(option)}
                                    onChange={() => handleCheckboxChange(category, option)}
                                />    
                                {option}        
                            </div>                                                                           
                        )}
                    </div>
                ))}
            </div>
            <div>
                
                <ul>

                    {getActiveFilters().map((filter, index) => (
                        <button 
                            key={index}
                            type="button"
                            onClick={() => handleRemoveFilter(filter)}
                        >
                            {filter.substring(filter.indexOf('-')+1)} x                         
                        </button>
                    ))}
                    {getActiveFilters().length > 1 && (
                        <button onClick={handleClearFilters}>Reset Filters</button>
                    )} 
                </ul>
            </div>
        </div>
    );
};

export default Filter;

