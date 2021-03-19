import React from "react";

const Metrics = ({ module }) => {
  const { fields } = module;
  return (
    <div className="bg-indigo-600 text-center text-white p-16 mb-8">
      <h3 className="font-bold text-3xl mb-6">{fields.title}</h3>
      <p className="text-gray-50 md:max-w-lg md:m-auto">{fields.text}</p>
      <div className="mt-8 md:grid md:grid-cols-3 md:max-w-4xl md:m-auto md:mt-12">
        <div className="mb-12 md:m-0">
          <h3 className="font-bold text-3xl mb-2 tracking-wider">
            {fields.metric1}
          </h3>
          <p>{fields.metric1Title}</p>
        </div>
        <div className="mb-12 md:m-0">
          <h3 className="font-bold text-3xl mb-2 tracking-wider">
            {fields.metric2}
          </h3>
          <p>{fields.metric2Title}</p>
        </div>
        <div>
          <h3 className="font-bold text-3xl mb-2 tracking-wider">
            {fields.metric3}
          </h3>
          <p>{fields.metric3Title}</p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
