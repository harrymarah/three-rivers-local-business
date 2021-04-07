// NOT IN USE, DELETE ME IF NOT FIXED BY DEPLOYMENT

const findAverageRating = (reviews) => {
    let sum = 0 
    let count = 0 
    for(let review of reviews){ 
    sum += review.rating  
        count++     
        }  
    return parseInt(sum/count)   
}