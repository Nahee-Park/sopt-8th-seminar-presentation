import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';

interface EachCardProps {
  imageUrl: Nullable<string>;
  title: Nullable<string>;
  description: Nullable<string>;
  dateCreated: Nullable<string>;
  center: Nullable<string>;
}

function EachCard(props: EachCardProps) {
  const { imageUrl, title, description, dateCreated, center } = props;

  return (
    <Card
      style={{
        width: '300px',
        height: '550px',
        background: '#f17878',
        borderRadius: '16px',
      }}
    >
      <Card.Img
        variant="top"
        src={
          imageUrl
            ? imageUrl
            : 'http://www.billking.co.kr/index/skin/board/basic_support/img/noimage.gif'
        }
        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>
          <strong>{title}</strong>
        </Card.Title>
        <Card.Text
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            wordBreak: 'break-all',
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Card.Text>
        <Card.Text>center : "{center}"</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">{dateCreated}</small>
      </Card.Footer>
    </Card>
  );
}

export default EachCard;
