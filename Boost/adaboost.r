library("adabag")

filename <- "/Users/latur/Documents/Bio/BioSummer/Boost/svm/full.csv"
data <- read.csv(filename)
size <- length(data[[1]])
data <- data[,2:ncol(data)]

e <- boosting(type~., data=data, boos=TRUE, mfinal=10)
importanceplot(e)
